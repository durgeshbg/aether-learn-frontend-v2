import { useState } from "react";
import { Menu } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router";
import { navbarConstants } from "./constants";
import { useAuth } from "@/hooks/useAuth";
import { routes } from "@/static-data/routes";

interface NavbarProps {
  className?: string;
}

const { appName, navLinks } = navbarConstants;

export function GlassmorphicNavbar({ className }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const userAvatarText = user?.firstName
    ? user.firstName[0] + (user.lastName ? user.lastName[0] : "")
    : "U";

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const handleProfile = () => {
    navigate(routes.PROFILE);
    setIsOpen(false);
  };

  const handleMobileMenuLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <header
      className={cn(
        "sticky w-11/12 top-2 left-0 right-0 z-50 h-16 mx-auto",
        "bg-background/70 backdrop-blur-xl backdrop-saturate-100",
        "border-2 border-border/40 rounded-md",
        "supports-[backdrop-filter]:bg-background/50",
        "shadow-sm shadow-accent-foreground/5",
        className,
      )}
    >
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <Link to="/app" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  {appName[0]}
                </span>
              </div>
              <span className="font-semibold text-lg text-foreground">
                {appName}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                {navLinks.map((link) => (
                  <NavigationMenuItem key={link.title}>
                    <Link to={link.url}>
                      <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent/60 hover:text-accent-foreground focus:bg-accent/60 focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                        {link.title}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            {/* Desktop actions */}
            <div className="hidden sm:flex items-center space-x-2">
              {/* <Button */}
              {/*   variant="ghost" */}
              {/*   size="icon" */}
              {/*   className="relative hover:bg-accent/60 focus:bg-accent/60 transition-colors" */}
              {/* > */}
              {/*   <Bell className="h-4 w-4" /> */}
              {/*   <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full"></span> */}
              {/* </Button> */}
            </div>

            {/* User Avatar */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full hover:bg-accent/60 focus:bg-accent/60"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/01.png" alt="@username" />
                    <AvatarFallback>{userAvatarText}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 bg-popover/90 backdrop-blur-xl border-border/50"
                align="end"
                forceMount
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{`${user?.firstName} ${user?.lastName}`}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || ""}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={handleProfile}
                >
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={handleLogout}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu trigger */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden hover:bg-accent/60 focus:bg-accent/60"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] sm:w-[400px] bg-background/90 backdrop-blur-xl border-border/50 rounded-lg p-4"
              >
                <nav className="flex flex-col space-y-4 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.title}
                      to={link.url}
                      className="flex items-center space-x-2 text-lg font-medium hover:text-primary transition-colors"
                      onClick={handleMobileMenuLinkClick}
                    >
                      <span>{link.title}</span>
                    </Link>
                  ))}
                  <div className="border-t border-border/50 my-4" />

                  {/* <Button variant="ghost" className="justify-start" size="lg"> */}
                  {/*   <Bell className="h-4 w-4 mr-2" /> */}
                  {/*   Notifications */}
                  {/* </Button> */}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
