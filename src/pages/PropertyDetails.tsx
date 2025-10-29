import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, DollarSign, Home, ArrowLeft, Phone, Mail } from "lucide-react";
import { toast } from "sonner";

type Property = {
  id: string;
  title: string;
  location: string;
  rent: number;
  type: string;
  description: string;
  image_url: string | null;
  profiles: {
    name: string;
    email: string;
    phone: string | null;
  };
};

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select(`
          *,
          profiles:owner_id (name, email, phone)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      setProperty(data);
    } catch (error: any) {
      toast.error("Failed to load property details");
      navigate("/properties");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">Loading...</div>
      </div>
    );
  }

  if (!property) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate("/properties")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Properties
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-96 bg-muted rounded-lg overflow-hidden">
              {property.image_url ? (
                <img
                  src={property.image_url}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Home className="h-24 w-24 text-muted-foreground" />
                </div>
              )}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-3xl">{property.title}</CardTitle>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-5 w-5 mr-2" />
                  {property.location}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{property.description}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm bg-primary/10 text-primary px-4 py-2 rounded-full">
                    {property.type}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Price</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-3xl font-bold text-primary">
                  <DollarSign className="h-8 w-8" />
                  {property.rent}
                  <span className="text-sm text-muted-foreground ml-2">/month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Owner Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-semibold">{property.profiles.name}</p>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 mr-2" />
                  {property.profiles.email}
                </div>
                {property.profiles.phone && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Phone className="h-4 w-4 mr-2" />
                    {property.profiles.phone}
                  </div>
                )}
                <Button className="w-full mt-4">Contact Owner</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
