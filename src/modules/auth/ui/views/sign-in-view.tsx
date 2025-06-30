"use client";

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
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export const SignInView = () => {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setError(null);
      await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });

      // Force navigation to dashboard to ensure clean session loading
      window.location.href = "/dashboard";
    } catch (err: any) {
      // Parse Better Auth error messages
      let errorMessage = "Invalid email or password. Please try again.";

      if (err?.message) {
        const message = err.message.toLowerCase();
        if (
          message.includes("invalid credentials") ||
          message.includes("incorrect")
        ) {
          errorMessage =
            "Invalid email or password. Please check your credentials.";
        } else if (message.includes("user not found")) {
          errorMessage =
            "No account found with this email. Please sign up first.";
        } else if (message.includes("password is too short")) {
          errorMessage =
            "Password is too short. Please use at least 8 characters.";
        } else if (message.includes("invalid email")) {
          errorMessage = "Please enter a valid email address.";
        }
      }

      // Check if it's a validation error from the server
      if (err?.status === 400 || err?.status === 401) {
        errorMessage = "Invalid email or password. Please try again.";
      }

      setError(errorMessage);
      console.error("Sign in error:", err);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      setError(null);
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard", // Redirect after successful sign-in
      });

      // Force clean navigation after Google auth
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    } catch (err) {
      setError("Failed to sign in with Google");
      console.error("Google sign in error:", err);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.3 1.63-4.51 1.63-3.86 0-7-3.14-7-7s3.14-7 7-7c1.73 0 3.26.59 4.47 1.74l2.5-2.5C18.16 3.59 15.63 2 12.48 2 7.1 2 3.22 5.89 3.22 10.92s3.88 8.92 9.26 8.92c2.73 0 4.88-1.02 6.62-2.73 1.84-1.84 2.36-4.29 2.36-6.51 0-.6-.05-1.19-.16-1.73l-8.44.01z"
        fill="currentColor"
      />
    </svg>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Log in
            </h1>
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/sign-up"
                className="text-blue-600 hover:underline"
                aria-label="Sign up for a new account"
              >
                Sign up
              </Link>
            </p>
          </div>

          <div className="space-y-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 py-3"
              aria-label="Continue with Google"
              disabled={isGoogleLoading}
            >
              <GoogleIcon className="h-5 w-5" />
              {isGoogleLoading ? "Redirecting..." : "Continue with Google"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500 uppercase tracking-wide">
                  OR
                </span>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-600 font-medium">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder=""
                          {...field}
                          aria-label="Email address"
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
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
                      <FormLabel className="text-gray-700 font-medium">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder=""
                          {...field}
                          aria-label="Password"
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="text-right">
                  <Link
                    href="#"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
                  aria-label="Log in to your account"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Logging in..." : "Log in"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};
