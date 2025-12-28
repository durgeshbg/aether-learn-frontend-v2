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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Checkbox } from "../../ui/checkbox";
import { Label } from "../../ui/label";
import { roles } from "./constants";
import TestData from "./test-data";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { userKeys } from "@/tanstack/keys/userKeys";
import { createUser } from "@/services/user";
import { axiosInstance } from "@/utils/axiosInstance";
import { UserCreateSchema } from "@/types/User";
import { organizationKeys } from "@/tanstack/keys/organizationKeys";
import { getOrganizations } from "@/services/organization";

export default function AddUserForm() {
  const form = useForm<z.infer<typeof UserCreateSchema>>({
    resolver: zodResolver(UserCreateSchema),
    defaultValues: {
      orgAdmin: false,
      role: "USER",
    },
  });

  const { mutate } = useMutation({
    mutationKey: userKeys.create(),
    mutationFn: async (data: z.infer<typeof UserCreateSchema>) => {
      return createUser(axiosInstance, data);
    },
    meta: {
      notify: true,
      successMessage: "User created successfully",
      invalidatesQueries: userKeys.all(),
    },
  });

  const {
    data: { organizations },
  } = useSuspenseQuery({
    queryKey: organizationKeys.all(),
    queryFn: async () => {
      return getOrganizations(axiosInstance);
    },
  });

  function onSubmit(data: z.infer<typeof UserCreateSchema>) {
    mutate(data);
    form.reset();
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-10">
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">
          Learner management
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Create new student
        </h1>
        <p className="text-muted-foreground">
          Capture profile, academic, and organization details in one place.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student information</CardTitle>
          <CardDescription>
            Required fields are marked. Everything can be updated later from the
            user record.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <section className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">Personal details</h3>
                  <p className="text-sm text-muted-foreground">
                    Basics for the profile.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last name</FormLabel>
                        <FormControl>
                          <Input placeholder="Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              <section className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">Account access</h3>
                  <p className="text-sm text-muted-foreground">
                    Credentials the student will use to sign in.
                  </p>
                </div>
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="student@college.edu"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Temporary password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              <section className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">Academic profile</h3>
                  <p className="text-sm text-muted-foreground">
                    Helps instructors understand their background.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="uniqueId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>University ID</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Roll number or student ID"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="branch"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Branch</FormLabel>
                        <FormControl>
                          <Input placeholder="Computer Science" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Graduation year</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={2000}
                            max={2100}
                            placeholder="2025"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              <section className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">Organization & role</h3>
                  <p className="text-sm text-muted-foreground">
                    Control where this student belongs and what they can see.
                  </p>
                </div>
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="organizationId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select organization" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {organizations.map(
                              (org: { id: string; name: string }) => (
                                <SelectItem key={org.id} value={org.id}>
                                  {org.name}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {roles.map((role) => (
                              <SelectItem key={role.value} value={role.value}>
                                {role.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="orgAdmin"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Label className="flex items-center gap-3 rounded-lg border border-dashed border-border/60 p-3">
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) =>
                                field.onChange(checked)
                              }
                            />
                            <span className="text-sm font-medium text-foreground">
                              Grant organization admin permissions
                            </span>
                          </Label>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                >
                  Reset
                </Button>
                <Button type="submit" className="sm:min-w-[160px]">
                  Create student
                </Button>
              </div>

              {import.meta.env.DEV && (
                <div className="rounded-lg border border-dashed border-border/60 p-4 text-sm text-muted-foreground">
                  <TestData form={form} />
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
