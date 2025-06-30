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
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { OnboardingData } from "@/types/onboarding";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

interface SignUpViewProps {
  onboardingData?: OnboardingData;
  onBack?: () => void;
}

export const SignUpView = ({
  onboardingData,
  onBack,
}: SignUpViewProps = {}) => {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
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
      setIsEmailLoading(true);
      setError(null);

      // SECURITY FIX: Completely clear ALL sessions before creating new account
      console.log("FORCE CLEARING all sessions before signup");
      try {
        // First, force sign out
        await authClient.signOut();

        // Wait a bit for signOut to complete
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Then aggressively clear ALL storage
        if (typeof window !== "undefined") {
          localStorage.clear();
          sessionStorage.clear();

          // Clear ALL cookies with all possible paths/domains
          document.cookie.split(";").forEach((c) => {
            const eqPos = c.indexOf("=");
            const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim();
            if (name) {
              document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
              document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
              document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
              document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
            }
          });

          // Force clear auth cookies
          const authCookies = [
            "better-auth",
            "auth-token",
            "session",
            "auth_session",
            "next-auth",
          ];
          authCookies.forEach((cookie) => {
            document.cookie = `${cookie}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
            document.cookie = `${cookie}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
            document.cookie = `${cookie}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
          });
        }

        // Additional sign out call to ensure complete clearing
        await authClient.signOut();

        console.log("Complete session clearing finished");

        // Wait before proceeding to ensure clean slate
        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (e) {
        console.warn("Error in session clearing:", e);
      }

      const result = await authClient.signUp.email({
        email: values.email,
        password: values.password,
        name: values.name,
      });

      if (!result.data?.user) {
        throw new Error("Sign-up failed - no user data returned");
      }

      // Verify session was created successfully
      const sessionCheck = await authClient.getSession();
      if (!sessionCheck.data?.user) {
        throw new Error("Session not established after sign-up");
      }

      // If we have onboarding data, update the user profile with additional fields
      if (
        onboardingData?.selectedLanguage &&
        onboardingData?.selectedLevel &&
        result.data?.user
      ) {
        try {
          // Update user with onboarding data using a separate API call
          await fetch("/api/auth/update-profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: result.data.user.id,
              learningLanguage: onboardingData.selectedLanguage.code,
              languageLevel: onboardingData.selectedLevel.code,
            }),
          });
        } catch (updateErr) {
          console.warn(
            "Failed to update profile with onboarding data:",
            updateErr
          );
        }
      }

      // Clear the auth flow flag and force page navigation
      console.log("✅ Signup successful, redirecting to dashboard");

      // Force navigation to dashboard (this will trigger auth context to load fresh session)
      window.location.href = "/dashboard";
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
        } else if (message.includes("session not established")) {
          errorMessage =
            "Account created but login failed. Please try signing in.";
        }
      }

      // Check if it's a validation error from the server
      if (err?.status === 400) {
        errorMessage = "Please check your information and try again.";
      }

      setError(errorMessage);
      console.error("Sign up error:", err);
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setIsGoogleLoading(true);
      setError(null);

      // SECURITY FIX: Completely clear ALL sessions before Google sign-up
      console.log("FORCE CLEARING all sessions before Google signup");
      try {
        // Force complete session clearing
        await authClient.signOut();
        await new Promise((resolve) => setTimeout(resolve, 100));

        if (typeof window !== "undefined") {
          localStorage.clear();
          sessionStorage.clear();

          // Aggressive cookie clearing
          document.cookie.split(";").forEach((c) => {
            const eqPos = c.indexOf("=");
            const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim();
            if (name) {
              document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
              document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
              document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
              document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
            }
          });

          // Clear auth cookies
          [
            "better-auth",
            "auth-token",
            "session",
            "auth_session",
            "next-auth",
          ].forEach((cookie) => {
            document.cookie = `${cookie}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
            document.cookie = `${cookie}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
            document.cookie = `${cookie}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
          });
        }

        await authClient.signOut();
        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (e) {
        console.warn("Error in session clearing:", e);
      }

      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard", // Redirect after successful sign-up
      });

      // Force page refresh after Google auth to ensure clean session loading
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
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
    <Card>
      <CardHeader>
        {onBack && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mb-6 text-gray-600 hover:text-gray-900 w-fit"
            aria-label="Go back to level selection"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        )}
        <div className="text-center">
          <CardTitle className="text-2xl font-semibold text-gray-900">
            {onBack ? "Almost there!" : "Sign up"}
          </CardTitle>
          <CardDescription>
            {onboardingData?.selectedLanguage
              ? `Just a bit more info to set up your ${onboardingData.selectedLanguage.name} learning account.`
              : "Create your account to start learning"}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignUp}
            className="w-full flex items-center justify-center gap-3"
            aria-label="Continue with Google"
            disabled={isGoogleLoading}
          >
            <GoogleIcon className="h-5 w-5" />
            {isGoogleLoading ? "Creating account..." : "Continue with Google"}
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="John Doe"
                        {...field}
                        aria-label="Full name"
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
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
                    <FormLabel className="text-gray-700 font-medium">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="m@example.com"
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
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                          aria-label="Password"
                          className="pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
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
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isEmailLoading || form.formState.isSubmitting}
                size="lg"
              >
                {isEmailLoading || form.formState.isSubmitting
                  ? "Creating account..."
                  : "Sign up"}
              </Button>
            </form>
          </Form>

          <div className="text-center text-sm text-gray-600">
            <p>
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="text-blue-600 hover:underline font-medium"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
