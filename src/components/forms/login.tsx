import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router";
import { routes } from "@/static-data/routes";
import { UserLoginSchema } from "@/types/User";
import {
  Mail,
  Lock,
  GraduationCap,
  Shield,
  Building2,
  User,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

export default function LoginForm() {
  const { isAuthenticated, login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof UserLoginSchema>>({
    resolver: zodResolver(UserLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit({ email, password }: z.infer<typeof UserLoginSchema>) {
    login({ email, password });
  }

  if (isAuthenticated) return <Navigate to={routes.HOME} replace />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background/50 backdrop-blur-sm p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--primary)_0%,_transparent_50%)] opacity-10" />
      <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--secondary)_0%,_transparent_50%)] opacity-10" />

      <div className="relative w-full max-w-md">
        {/* Main Card */}
        <div className="rounded-3xl bg-card/40 backdrop-blur-md border border-border/20 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="relative p-8 pb-6 bg-gradient-to-br from-primary/10 to-secondary/10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
            <div className="relative text-center">
              <div className="mx-auto w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm border border-primary/30">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-2">
                Welcome Back
              </h1>
              <p className="text-muted-foreground">
                Sign in to your student portal
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="p-8 pt-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="student@college.edu"
                            className="pl-10 bg-background/50 border-border/40 backdrop-blur-sm focus:bg-background/70 focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription className="text-muted-foreground/80">
                        Enter your registered email address
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••••"
                            className="pl-10 pr-10 bg-background/50 border-border/40 backdrop-blur-sm focus:bg-background/70 focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormDescription className="text-muted-foreground/80">
                        Enter your account password
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 backdrop-blur-sm transition-all duration-200 hover:shadow-xl hover:shadow-primary/30"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </form>
            </Form>

            {/* Demo Accounts */}
            <div className="mt-8 pt-6 border-t border-border/20">
              <p className="text-xs text-muted-foreground text-center mb-4">
                Demo Accounts - For Testing
              </p>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  className="bg-red-500/10 border-red-500/20 text-red-700 hover:bg-red-500/20 backdrop-blur-sm text-xs"
                  onClick={() => {
                    form.setValue("email", "admin1@mail.com");
                    form.setValue("password", "password");
                  }}
                >
                  <Shield className="h-3 w-3 mr-1" />
                  Admin
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  className="bg-purple-500/10 border-purple-500/20 text-purple-700 hover:bg-purple-500/20 backdrop-blur-sm text-xs"
                  onClick={() => {
                    form.setValue("email", "org1admin@mail.com");
                    form.setValue("password", "password");
                  }}
                >
                  <Building2 className="h-3 w-3 mr-1" />
                  Org Admin
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  className="bg-blue-500/10 border-blue-500/20 text-blue-700 hover:bg-blue-500/20 backdrop-blur-sm text-xs"
                  onClick={() => {
                    form.setValue("email", "user1@mail.com");
                    form.setValue("password", "password");
                  }}
                >
                  <User className="h-3 w-3 mr-1" />
                  Student
                </Button>
              </div>
            </div>

            {/* Footer Links */}
            <div className="mt-6 text-center space-y-2">
              <button className="text-sm text-primary hover:text-primary/80 transition-colors">
                Forgot your password?
              </button>
              <p className="text-xs text-muted-foreground">
                Need help? Contact your institution's IT support
              </p>
            </div>
          </div>

          {/* Subtle glow effect */}
          <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-primary/5 to-secondary/5 blur-xl" />
        </div>

        {/* Floating elements for visual appeal */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl animate-pulse" />
        <div
          className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary/10 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>
    </div>
  );
}
