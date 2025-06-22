import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { useBusinessContext } from "@/hooks/use-business-context";
import { useMutation, useQuery } from "@tanstack/react-query";

import { queryClient } from "@/lib/queryClient";
import { TranslatableText } from "@/components/translatable-text";
import { useTranslationHelper } from "@/lib/translation-helper";

interface Business {
  id: number;
  name: string;
  description?: string;
}

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedBusinessId, setSelectedBusinessId] = useState<number | null>(
    null,
  );
  const [step, setStep] = useState<"credentials" | "business">("credentials");
  const [validatedUser, setValidatedUser] = useState<any>(null);
  const { toast } = useToast();
  const { t } = useTranslationHelper();
  const { setUser } = useAuth();
  const { updateSelectedBusiness } = useBusinessContext();

  // Query to get user businesses after credentials validation
  const { data: userBusinesses = [], isLoading: loadingBusinesses } = useQuery<
    Business[]
  >({
    queryKey: ["/api/user-businesses"],
    enabled: step === "business" && !!validatedUser,
    staleTime: 0, // Data is immediately stale
    gcTime: 0, // Don't keep in cache
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnWindowFocus: false, // Don't refetch on window focus for login
  });

  const validateCredentialsMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Invalid credentials");
      }

      return response.json();
    },
    onSuccess: (data) => {
      setValidatedUser(data);
      // Clear all cached data to ensure fresh login
      queryClient.clear();
      // Store JWT tokens temporarily for fetching businesses
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      setStep("business");
      toast({
        title: t("Credentials validated"),
        description: t("Please select your business"),
      });
    },
    onError: (error: Error) => {
      toast({
        title: t("Login failed"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const completeLoginMutation = useMutation({
    mutationFn: async (businessId: number) => {
      // Store selected business ID
      localStorage.setItem("x-selected-business-id", businessId.toString());
      sessionStorage.setItem("x-selected-business-id", businessId.toString());
      return { businessId };
    },
    onSuccess: (data) => {
      setUser(validatedUser.user);
      // Invalidate all queries to refresh data with new user context
      queryClient.invalidateQueries();
      toast({
        title: t("Login successful"),
        description: t("Welcome to BarberPro Dashboard"),
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: t("Login failed"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCredentialsSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: t("Missing credentials"),
        description: t("Please enter both email and password"),
        variant: "destructive",
      });
      return;
    }
    validateCredentialsMutation.mutate({ email, password });
  };

  const handleBusinessSelect = async () => {
    if (!selectedBusinessId) {
      toast({
        title: t("Business required"),
        description: t("Please select a business to continue"),
        variant: "destructive",
      });
      return;
    }

    // Update business context which automatically loads business language settings
    await updateSelectedBusiness(selectedBusinessId);
    completeLoginMutation.mutate(selectedBusinessId);
  };

  const handleBackToCredentials = () => {
    setStep("credentials");
    setValidatedUser(null);
    setSelectedBusinessId(null);
    // Clear temporary tokens
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl flex gap-8">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-barber-primary rounded-xl flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="mt-6 text-3xl font-bold text-slate-900">
                <TranslatableText>Welcome to BarberPro</TranslatableText>
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                <TranslatableText>
                  Sign in to your account to continue
                </TranslatableText>
              </p>
            </div>

            {step === "credentials" ? (
              <form onSubmit={handleCredentialsSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="email"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      <TranslatableText>Email address</TranslatableText>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="focus:ring-barber-primary focus:border-barber-primary"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="password"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      <TranslatableText>Password</TranslatableText>
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="focus:ring-barber-primary focus:border-barber-primary"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember-me" />
                    <Label
                      htmlFor="remember-me"
                      className="text-sm text-slate-700"
                    >
                      <TranslatableText>Remember me</TranslatableText>
                    </Label>
                  </div>
                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-medium barber-primary hover:text-barber-secondary"
                    >
                      <TranslatableText>Forgot your password?</TranslatableText>
                    </a>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={validateCredentialsMutation.isPending}
                  className="w-full bg-barber-primary hover:bg-barber-secondary focus:ring-barber-primary"
                >
                  {validateCredentialsMutation.isPending
                    ? "Validating..."
                    : "Continue"}
                </Button>

                <div className="text-center space-y-3">
                  <p className="text-sm text-slate-600">
                    <TranslatableText>Don't have an account?</TranslatableText>{" "}
                    <a
                      href="#"
                      className="font-medium barber-primary hover:text-barber-secondary"
                    >
                      <TranslatableText>
                        Contact your administrator
                      </TranslatableText>
                    </a>
                  </p>
                  <p className="text-sm">
                    <Link
                      href="/landing"
                      className="font-medium text-barber-primary hover:text-barber-secondary"
                    >
                      ← <TranslatableText>Go to home</TranslatableText>
                    </Link>
                  </p>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-sm text-slate-600 mb-4">
                    <TranslatableText>Welcome</TranslatableText> {email}
                  </p>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    <TranslatableText>Select your business</TranslatableText>
                  </h3>
                  <p className="text-sm text-slate-600">
                    <TranslatableText>
                      Choose the business you want to access
                    </TranslatableText>
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="business"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      <TranslatableText>Business</TranslatableText>
                    </Label>
                    {loadingBusinesses ? (
                      <div className="text-center py-4">
                        <TranslatableText>
                          Loading businesses...
                        </TranslatableText>
                      </div>
                    ) : (
                      <Select
                        value={selectedBusinessId?.toString() || ""}
                        onValueChange={(value) =>
                          setSelectedBusinessId(parseInt(value))
                        }
                      >
                        <SelectTrigger className="focus:ring-barber-primary focus:border-barber-primary">
                          <SelectValue placeholder="Select a business" />
                        </SelectTrigger>
                        <SelectContent>
                          {userBusinesses.map((business) => (
                            <SelectItem
                              key={business.id}
                              value={business.id.toString()}
                            >
                              {business.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBackToCredentials}
                    className="w-full"
                    disabled={completeLoginMutation.isPending}
                  >
                    <TranslatableText>Back</TranslatableText>
                  </Button>
                  <Button
                    type="button"
                    onClick={handleBusinessSelect}
                    disabled={
                      !selectedBusinessId ||
                      completeLoginMutation.isPending ||
                      loadingBusinesses
                    }
                    className="w-full bg-barber-primary hover:bg-barber-secondary focus:ring-barber-primary"
                  >
                    {completeLoginMutation.isPending
                      ? "Signing in..."
                      : "Sign in"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
