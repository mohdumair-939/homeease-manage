import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Building2, Search, Shield, Users } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  const features = [
    {
      icon: Search,
      title: "Easy Search",
      description: "Find your perfect rental with advanced filtering options",
    },
    {
      icon: Shield,
      title: "Verified Listings",
      description: "All properties are verified for authenticity and quality",
    },
    {
      icon: Users,
      title: "For Everyone",
      description: "Perfect for students and working professionals",
    },
    {
      icon: Building2,
      title: "Manage Properties",
      description: "Owners can easily list and manage their properties",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
        <img 
          src={heroBg} 
          alt="Modern apartment building" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
        />
        <div className="relative z-10 container mx-auto px-4 text-center text-primary-foreground">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Simplifying Rentals for Students & Professionals
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Find your perfect PG, flat, or room with RentEase - Your trusted rental platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/properties">Browse Properties</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/auth?mode=signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why Choose RentEase?</h2>
          <p className="text-xl text-muted-foreground">Everything you need in one platform</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-hover transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center text-primary-foreground">
          <h2 className="text-4xl font-bold mb-6">Ready to Find Your Perfect Space?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied tenants and property owners on RentEase
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/properties">Start Browsing</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
