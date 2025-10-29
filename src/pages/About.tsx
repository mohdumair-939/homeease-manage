import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, Shield, Heart } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Building2,
      title: "Verified Properties",
      description: "All properties are verified by our team to ensure quality and authenticity.",
    },
    {
      icon: Users,
      title: "Easy Management",
      description: "Property owners can easily manage their listings through our dashboard.",
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Your data is protected with industry-standard security measures.",
    },
    {
      icon: Heart,
      title: "Customer First",
      description: "We prioritize customer satisfaction and provide excellent support.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">About RentEase</h1>
            <p className="text-xl text-muted-foreground">
              Simplifying rentals for students and professionals
            </p>
          </div>

          <Card className="mb-12">
            <CardContent className="pt-6">
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                RentEase is a comprehensive rental property management platform designed to bridge
                the gap between tenants and property owners. We understand the challenges faced by
                students and working professionals when searching for accommodation, and we're here
                to make that process seamless and stress-free.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our platform provides verified property listings, secure user authentication, digital
                property management tools, and a seamless search and booking experience. Whether
                you're looking for a PG, flat, or room, or you're a property owner wanting to reach
                the right tenants, RentEase is your trusted partner.
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground">
                To create a transparent, efficient, and user-friendly platform that connects
                property owners with potential tenants, making the rental process simple, secure,
                and accessible for everyone.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;
