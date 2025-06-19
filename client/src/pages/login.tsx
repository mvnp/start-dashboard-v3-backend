import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/lib/queryClient";
import { TranslatableText } from "@/components/translatable-text";

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const { setUser } = useAuth();



  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      // Store JWT tokens in localStorage
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      
      setUser(data.user);
      // Invalidate all queries to refresh data with new user context
      queryClient.invalidateQueries();
      toast({
        title: "Login successful",
        description: "Welcome to BarberPro Dashboard"
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Missing credentials",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl flex gap-8">
        <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-barber-primary rounded-xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-slate-900"><TranslatableText>Welcome to BarberPro</TranslatableText></h2>
            <p className="mt-2 text-sm text-slate-600"><TranslatableText>Sign in to your account to continue</TranslatableText></p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
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
                <Label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
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
                <Label htmlFor="remember-me" className="text-sm text-slate-700">
                  <TranslatableText>Remember me</TranslatableText>
                </Label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium barber-primary hover:text-barber-secondary">
                  <TranslatableText>Forgot your password?</TranslatableText>
                </a>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-barber-primary hover:bg-barber-secondary focus:ring-barber-primary"
            >
              {loginMutation.isPending ? "Signing in..." : "Sign in"}
            </Button>

            <div className="text-center space-y-3">
              <p className="text-sm text-slate-600">
                <TranslatableText>Don't have an account?</TranslatableText>{" "}
                <a href="#" className="font-medium barber-primary hover:text-barber-secondary">
                  <TranslatableText>Contact your administrator</TranslatableText>
                </a>
              </p>
              <p className="text-sm">
                <Link href="/landing" className="font-medium text-barber-primary hover:text-barber-secondary">
                  ← <TranslatableText>Go to home</TranslatableText>
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
