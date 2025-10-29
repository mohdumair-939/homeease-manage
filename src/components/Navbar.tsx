import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Building2, Info, Mail, LogOut, LayoutDashboard, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";

export const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkUserRoles(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkUserRoles(session.user.id);
      } else {
        setIsOwner(false);
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUserRoles = async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    
    if (data) {
      setIsOwner(data.some(r => r.role === "owner"));
      setIsAdmin(data.some(r => r.role === "admin"));
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">RentEase</span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            <Button variant="ghost" asChild>
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/properties">
                <Building2 className="mr-2 h-4 w-4" />
                Properties
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/about">
                <Info className="mr-2 h-4 w-4" />
                About
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/contact">
                <Mail className="mr-2 h-4 w-4" />
                Contact
              </Link>
            </Button>

            {user && isOwner && (
              <Button variant="ghost" asChild>
                <Link to="/owner/dashboard">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
            )}

            {user && isAdmin && (
              <Button variant="ghost" asChild>
                <Link to="/admin/dashboard">
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Admin
                </Link>
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {user ? (
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/auth">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/auth?mode=signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
