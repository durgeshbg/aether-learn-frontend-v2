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
import Logo from "./Logo";

interface NavbarProps {
  className?: string;
}

const { appName, navLinks } = navbarConstants;

export function GlassmorphicNavbar({ className }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const pathname = window.location.pathname;
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
        "sticky w-11/12 top-4 left-0 right-0 z-50 h-16 mx-auto",
        "bg-white/10 backdrop-blur-2xl backdrop-saturate-150",
        "border border-white/20 rounded-2xl shadow-2xl shadow-black/10",
        "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-white/5 before:to-transparent before:pointer-events-none",
        "after:absolute after:inset-0 after:rounded-2xl after:bg-gradient-to-b after:from-white/10 after:to-transparent after:pointer-events-none",
        "supports-[backdrop-filter]:bg-white/8",
        "transition-all duration-300 hover:bg-white/15 hover:shadow-3xl hover:border-white/30",
        className,
      )}
    >
      <div className="container mx-auto px-6 h-full relative z-10">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <Link
              to={routes.HOME}
              className="flex items-center space-x-3 group"
            >
              <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 group-hover:bg-white/25 group-hover:scale-105 transition-all duration-300">
                <Logo />
              </div>
              <span className="font-bold text-xl text-white/95 hidden md:inline-block tracking-tight group-hover:text-white transition-colors duration-300">
                {appName}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList className="space-x-2">
                {navLinks.map((link) => (
                  <NavigationMenuItem key={link.title}>
                    <Link to={link.url}>
                      <NavigationMenuLink
                        className={cn(
                          "group inline-flex h-10 w-max items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold",
                          "transition-all duration-300 backdrop-blur-sm border border-white/15",
                          "hover:bg-white/20 hover:border-white/30 hover:scale-105 hover:shadow-lg hover:shadow-white/10",
                          "focus:bg-white/20 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20",
                          "disabled:pointer-events-none disabled:opacity-50",
                          "relative overflow-hidden",
                          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent before:translate-x-[-100%] before:transition-transform before:duration-700 hover:before:translate-x-[100%]",
                          link.url === window.location.pathname
                            ? "bg-white/25 text-white border-white/40 shadow-lg shadow-white/20"
                            : "bg-white/10 text-white/90 hover:text-white",
                        )}
                      >
                        {link.title}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            {/* Desktop actions */}
            <div className="hidden sm:flex items-center space-x-2">
              {/* Uncomment if needed */}
            </div>

            {/* User Avatar */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 hover:bg-white/25 hover:scale-105 hover:border-white/30 focus:bg-white/25 transition-all duration-300 shadow-lg"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/01.png" alt="@username" />
                    <AvatarFallback className="bg-white/20 text-white font-semibold">
                      {userAvatarText}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-64 bg-white/10 backdrop-blur-2xl border-white/20 rounded-xl shadow-2xl shadow-black/20"
                align="end"
                forceMount
              >
                <DropdownMenuLabel className="font-normal p-4">
                  <div className="flex flex-col space-y-2">
                    <p className="text-sm font-semibold leading-none text-white">{`${user?.firstName} ${user?.lastName}`}</p>
                    <p className="text-xs leading-none text-white/70">
                      {user?.email || ""}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/20" />
                <DropdownMenuItem
                  className="cursor-pointer text-white/90 hover:text-white hover:bg-white/15 rounded-lg m-1 transition-all duration-200"
                  onClick={handleProfile}
                >
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer text-white/90 hover:text-white hover:bg-white/15 rounded-lg m-1 transition-all duration-200"
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
                  className="md:hidden h-10 w-10 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 hover:bg-white/25 hover:scale-105 hover:border-white/30 focus:bg-white/25 transition-all duration-300 shadow-lg"
                >
                  <Menu className="h-5 w-5 text-white" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[320px] sm:w-[400px] bg-white/10 backdrop-blur-2xl border-white/20 rounded-2xl p-6 shadow-2xl shadow-black/20"
              >
                <nav className="flex flex-col space-y-4 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.title}
                      to={link.url}
                      className="flex items-center space-x-3 text-lg font-semibold text-white/90 hover:text-white transition-all duration-300 p-3 rounded-xl hover:bg-white/15 hover:scale-105"
                      onClick={handleMobileMenuLinkClick}
                    >
                      <span>{link.title}</span>
                    </Link>
                  ))}
                  <div className="border-t border-white/20 my-6" />
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
