import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, DollarSign, Home } from "lucide-react";
import { toast } from "sonner";

type Property = {
  id: string;
  title: string;
  location: string;
  rent: number;
  type: string;
  description: string;
  image_url: string | null;
};

const Properties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: "",
    type: "all",
    maxRent: "",
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, properties]);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("is_available", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProperties(data || []);
      setFilteredProperties(data || []);
    } catch (error: any) {
      toast.error("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...properties];

    if (filters.location) {
      filtered = filtered.filter((p) =>
        p.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.type !== "all") {
      filtered = filtered.filter((p) => p.type === filters.type);
    }

    if (filters.maxRent) {
      const maxRent = parseFloat(filters.maxRent);
      filtered = filtered.filter((p) => p.rent <= maxRent);
    }

    setFilteredProperties(filtered);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Available Properties</h1>
          <p className="text-muted-foreground">Find your perfect rental space</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Input
            placeholder="Search by location..."
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          />
          <Select
            value={filters.type}
            onValueChange={(value) => setFilters({ ...filters, type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="PG">PG</SelectItem>
              <SelectItem value="Flat">Flat</SelectItem>
              <SelectItem value="Room">Room</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="number"
            placeholder="Max Rent"
            value={filters.maxRent}
            onChange={(e) => setFilters({ ...filters, maxRent: e.target.value })}
          />
          <Button
            variant="outline"
            onClick={() => setFilters({ location: "", type: "all", maxRent: "" })}
          >
            Clear Filters
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading properties...</div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No properties found matching your criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <Card key={property.id} className="overflow-hidden hover:shadow-hover transition-shadow">
                <div className="h-48 bg-muted overflow-hidden">
                  {property.image_url ? (
                    <img
                      src={property.image_url}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Home className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-1">{property.title}</CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.location}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {property.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center text-lg font-bold text-primary">
                      <DollarSign className="h-5 w-5" />
                      {property.rent}/month
                    </div>
                    <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                      {property.type}
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => navigate(`/properties/${property.id}`)}
                  >
                    View Details
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

export default Properties;
