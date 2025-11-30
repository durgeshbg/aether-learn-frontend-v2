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
import { Link, useLocation, useNavigate } from "react-router";
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
  const location = useLocation();
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
        "sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80",
        className,
      )}
    >
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <div className="flex flex-1 items-center gap-6">
          <Link
            to={routes.HOME}
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-foreground transition-colors hover:bg-muted/60"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-md border border-primary/20 bg-primary/10 text-primary">
              <Logo />
            </div>
            <span className="hidden text-base font-semibold md:inline-block">
              {appName}
            </span>
          </Link>
        </div>

        <div className="hidden flex-1 items-center justify-center md:flex">
          <NavigationMenu>
            <NavigationMenuList className="flex items-center gap-3">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.url;

                return (
                  <NavigationMenuItem key={link.title}>
                    <Link to={link.url}>
                      <NavigationMenuLink
                        className={cn(
                          "inline-flex items-center rounded-md px-3.5 py-2 text-sm font-medium transition-colors",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                          "disabled:pointer-events-none",
                          isActive
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:bg-primary/10 hover:text-primary",
                        )}
                      >
                        {link.title}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-10 w-10 rounded-full border border-border bg-muted/40 p-0 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/01.png" alt="@username" />
                  <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                    {userAvatarText}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-64 rounded-xl border border-border bg-card shadow-lg"
              align="end"
              forceMount
            >
              <DropdownMenuLabel className="p-4 font-normal">
                <div className="flex flex-col space-y-2">
                  <p className="text-sm font-semibold leading-none text-foreground">{`${user?.firstName} ${user?.lastName}`}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || ""}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer rounded-lg text-sm text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                onClick={handleProfile}
              >
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer rounded-lg text-sm text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={handleLogout}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-lg border border-border bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground md:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[320px] border-l border-border bg-background p-5 sm:w-[360px]"
            >
              <nav className="mt-6 flex flex-col gap-2.5">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.url;

                  return (
                    <Link
                      key={link.title}
                      to={link.url}
                      className={cn(
                        "rounded-md px-3.5 py-2 text-base font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-primary/10 hover:text-primary",
                      )}
                      onClick={handleMobileMenuLinkClick}
                    >
                      {link.title}
                    </Link>
                  );
                })}
                <div className="my-4 border-t border-border" />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
