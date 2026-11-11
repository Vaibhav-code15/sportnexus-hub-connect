import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Home, Menu, Calendar, Box, Video, User, LogOut, Shield, BookmarkCheck } from "lucide-react";
import { NavItem } from "@/types";
import { useAuth } from "@/context/AuthContext";

interface SidebarProps {
  className?: string;
}

const mainNavItems: NavItem[] = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Venues",
    href: "/venues",
    icon: Calendar,
  },
  {
    title: "Equipment",
    href: "/equipment",
    icon: Box,
  },
  {
    title: "Tutorials",
    href: "/tutorials",
    icon: Video,
  },
  {
    title: "My Bookings",
    href: "/bookings",
    icon: BookmarkCheck,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
];

// Admin nav item
const adminNavItem: NavItem = {
  title: "Admin Dashboard",
  href: "/admin",
  icon: Shield,
};

export function Sidebar({ className }: SidebarProps) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
  };
  
  // Check if user is admin
  const isAdmin = user?.role === 'admin';
  
  // Create navigation items based on user role
  const navItems = isAdmin ? [...mainNavItems, adminNavItem] : mainNavItems;
  
  return (
    <>
      {/* Mobile Navigation - Hamburger Menu */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="pr-0">
          <MobileNav items={navItems} setOpen={setOpen} onLogout={handleLogout} userName={user?.name} />
        </SheetContent>
      </Sheet>
      
      {/* Desktop Navigation - Sidebar */}
      <div className={cn("hidden md:flex", className)}>
        <DesktopNav items={navItems} onLogout={handleLogout} userName={user?.name} />
      </div>
    </>
  );
}

interface MobileNavProps {
  items: NavItem[];
  setOpen: (open: boolean) => void;
  onLogout: () => void;
  userName?: string;
}

function MobileNav({ items, setOpen, onLogout, userName }: MobileNavProps) {
  const location = useLocation();
  
  return (
    <div className="flex flex-col gap-6 px-2">
      <Link 
        to="/" 
        className="flex items-center" 
        onClick={() => setOpen(false)}
      >
        <span className="font-bold text-xl">SportNexus</span>
      </Link>
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="flex flex-col gap-2 py-2">
          {items.map((item) => 
            item.disabled ? null : (
              <Link
                key={item.title}
                to={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  location.pathname === item.href ? "bg-accent text-accent-foreground" : "transparent"
                )}
              >
                {item.icon && <item.icon className="h-5 w-5" />}
                {item.title}
              </Link>
            )
          )}
          
          {/* User information and logout */}
          <div className="mt-4 border-t pt-4">
            {userName && (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                Signed in as: {userName}
              </div>
            )}
            <button
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-red-500 hover:bg-accent"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

interface DesktopNavProps {
  items: NavItem[];
  onLogout: () => void;
  userName?: string;
}

function DesktopNav({ items, onLogout, userName }: DesktopNavProps) {
  const location = useLocation();
  
  return (
    <div className="flex h-screen flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <Link to="/" className="flex items-center">
          <span className="font-bold text-xl">SportNexus</span>
        </Link>
      </div>
      <ScrollArea className="flex-1">
        <nav className="grid gap-1 px-2 py-4">
          {items.map((item) =>
            item.disabled ? null : (
              <Link
                key={item.title}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  location.pathname === item.href ? "bg-accent text-accent-foreground" : "transparent"
                )}
              >
                {item.icon && <item.icon className="h-5 w-5" />}
                {item.title}
              </Link>
            )
          )}
        </nav>
      </ScrollArea>
      
      {/* User information and logout */}
      <div className="border-t p-4">
        {userName && (
          <div className="mb-2 text-sm text-muted-foreground">
            Signed in as: {userName}
          </div>
        )}
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-red-500 hover:bg-accent"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
