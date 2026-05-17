import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Mail, Lock, Shield, Building2, User, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import Logo from "@/components/navbar/Logo";

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
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-10 px-4 py-12 lg:flex-row lg:items-center">
      <section className="flex-1 space-y-6 text-center lg:text-left">
        <div className="inline-flex items-center gap-3 rounded-md border border-border px-6 py-4 text-lg font-semibold text-muted-foreground">
          <span className="inline-flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Logo />
          </span>
          Secure access · Aether Learn
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Sign in to your workspace
          </h1>
          <p className="text-muted-foreground">
            One credential unlocks courses, submissions, and organization tools
            with the same minimalist system the rest of the app uses.
          </p>
        </div>
      </section>

      <Card className="flex-1 max-w-md border border-border/70 shadow-sm mx-auto">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Login</CardTitle>
          <CardDescription>
            Use the email and password provided by your organization.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="you@school.edu"
                          className="pl-10"
                          autoComplete="email"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      We’ll never share your information.
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-10 pr-10"
                          autoComplete="current-password"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Keep your password private to protect course data.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Sign in
              </Button>
            </form>
          </Form>

          <div className="space-y-3 rounded-lg border border-dashed border-border/70 p-4">
            <p className="text-xs font-medium uppercase text-muted-foreground">
              Demo accounts
            </p>
            <div className="grid gap-2 sm:grid-cols-3">
              <Button
                variant="outline"
                size="sm"
                type="button"
                className="justify-start"
                onClick={() => {
                  form.setValue("email", "admin1@mail.com");
                  form.setValue("password", "password");
                }}
              >
                <Shield className="mr-2 h-3.5 w-3.5" />
                Admin
              </Button>
              <Button
                variant="outline"
                size="sm"
                type="button"
                className="justify-start"
                onClick={() => {
                  form.setValue("email", "org1admin@mail.com");
                  form.setValue("password", "password");
                }}
              >
                <Building2 className="mr-2 h-3.5 w-3.5" />
                Org admin
              </Button>
              <Button
                variant="outline"
                size="sm"
                type="button"
                className="justify-start"
                onClick={() => {
                  form.setValue("email", "user1@mail.com");
                  form.setValue("password", "password");
                }}
              >
                <User className="mr-2 h-3.5 w-3.5" />
                Student
              </Button>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Need help? Contact your organization’s IT support.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
