import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, MapPin, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const propertySchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  location: z.string().min(1, "Location is required").max(100),
  rent: z.number().positive("Rent must be positive"),
  type: z.enum(["PG", "Flat", "Room"]),
  description: z.string().min(1, "Description is required").max(500),
});

type Property = {
  id: string;
  title: string;
  location: string;
  rent: number;
  type: string;
  description: string;
  is_available: boolean;
};

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    rent: "",
    type: "PG",
    description: "",
  });

  useEffect(() => {
    checkAccess();
    fetchProperties();
  }, []);

  const checkAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);

    if (!roles?.some(r => r.role === "owner")) {
      toast.error("Access denied. Owner role required.");
      navigate("/");
    }
  };

  const fetchProperties = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error: any) {
      toast.error("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validation = propertySchema.parse({
        ...formData,
        rent: parseFloat(formData.rent),
      });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (editingProperty) {
        const { error } = await supabase
          .from("properties")
          .update(validation)
          .eq("id", editingProperty.id);

        if (error) throw error;
        toast.success("Property updated successfully");
      } else {
        const { error } = await supabase
          .from("properties")
          .insert([{ 
            title: validation.title,
            location: validation.location,
            rent: validation.rent,
            type: validation.type,
            description: validation.description,
            owner_id: user.id 
          }]);

        if (error) throw error;
        toast.success("Property added successfully");
      }

      setDialogOpen(false);
      setEditingProperty(null);
      setFormData({ title: "", location: "", rent: "", type: "PG", description: "" });
      fetchProperties();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Failed to save property");
      }
    }
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setFormData({
      title: property.title,
      location: property.location,
      rent: property.rent.toString(),
      type: property.type,
      description: property.description,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    try {
      const { error } = await supabase.from("properties").delete().eq("id", id);

      if (error) throw error;
      toast.success("Property deleted successfully");
      fetchProperties();
    } catch (error: any) {
      toast.error("Failed to delete property");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Properties</h1>
            <p className="text-muted-foreground">Manage your rental listings</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Property
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingProperty ? "Edit Property" : "Add New Property"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rent">Rent ($/month)</Label>
                    <Input
                      id="rent"
                      type="number"
                      value={formData.rent}
                      onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Property Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PG">PG</SelectItem>
                      <SelectItem value="Flat">Flat</SelectItem>
                      <SelectItem value="Room">Room</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setDialogOpen(false);
                      setEditingProperty(null);
                      setFormData({ title: "", location: "", rent: "", type: "PG", description: "" });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingProperty ? "Update" : "Add"} Property
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No properties yet</p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Property
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Card key={property.id}>
                <CardHeader>
                  <CardTitle className="line-clamp-1">{property.title}</CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.location}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {property.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-lg font-bold text-primary">
                      <DollarSign className="h-5 w-5" />
                      {property.rent}/month
                    </div>
                    <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                      {property.type}
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${property.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {property.is_available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(property)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(property.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
