"use client";

import { Card, CardContent } from "@/components/ui/card";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export const SignUpView = () => {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setError(null);
      await authClient.signUp.email({
        email: values.email,
        password: values.password,
        name: values.name,
      });

      // Redirect to dashboard after successful sign-up
      router.push("/dashboard");
    } catch (err: any) {
      // Parse Better Auth error messages
      let errorMessage = "Failed to create account. Please try again.";

      if (err?.message) {
        const message = err.message.toLowerCase();
        if (message.includes("password is too short")) {
          errorMessage =
            "Password is too short. Please use at least 8 characters.";
        } else if (message.includes("email") && message.includes("already")) {
          errorMessage =
            "Email is already in use. Please try a different email.";
        } else if (message.includes("invalid email")) {
          errorMessage = "Please enter a valid email address.";
        } else if (message.includes("password")) {
          errorMessage =
            "Password does not meet requirements. Please use at least 8 characters.";
        }
      }

      // Check if it's a validation error from the server
      if (err?.status === 400) {
        errorMessage = "Please check your information and try again.";
      }

      setError(errorMessage);
      console.error("Sign up error:", err);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setIsGoogleLoading(true);
      setError(null);
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard", // Redirect after successful sign-up
      });
    } catch (err) {
      setError("Failed to sign up with Google");
      console.error("Google sign up error:", err);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6 md:p-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
              >
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Let's get started</h1>
                  <p className="text-muted-foreground text-balance">
                    Create your account
                  </p>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="John Doe"
                            {...field}
                            aria-label="Full name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="m@example.com"
                            {...field}
                            aria-label="Email address"
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
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              {...field}
                              aria-label="Password"
                              className="pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={togglePasswordVisibility}
                              aria-label={
                                showPassword ? "Hide password" : "Show password"
                              }
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-black hover:bg-gray-800 text-white"
                  aria-label="Create your account"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting
                    ? "Creating account..."
                    : "Sign up"}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="w-full">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoogleSignUp}
                    className="w-full"
                    aria-label="Continue with Google"
                    disabled={isGoogleLoading}
                  >
                    {isGoogleLoading ? "Creating account..." : "Google"}
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                      href="/sign-in"
                      className="underline underline-offset-4 hover:text-primary"
                      aria-label="Sign in to your existing account"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </form>
            </Form>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-800 relative hidden md:flex flex-col gap-y-4 items-center justify-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
              <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-full"></div>
              </div>
            </div>
            <p className="text-2xl font-semibold text-white">Fluentzy.AI</p>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <Link
            href="/terms"
            className="underline underline-offset-4 hover:text-primary"
            aria-label="Read our Terms of Service"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-4 hover:text-primary"
            aria-label="Read our Privacy Policy"
          >
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
};
