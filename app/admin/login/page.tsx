"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useRouter } from "next/navigation";
import { LockIcon, MailIcon, ShieldCheckIcon, Loader2Icon } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Show loader
    setIsLoading(true);

    if (typeof window !== "undefined" && window.mixpanel) {
      window.mixpanel.track("Admin Login Submitted", {
        email_domain: email.split("@")[1] || "unknown",
        has_password: password.length > 0,
      });
    }

    // Simulate auth with loader then redirect to dashboard
    setTimeout(() => {
      router.push("/admin/dashboard");
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md space-y-8 px-4">
          {/* Logo and Header */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-blue-600 rounded-lg">
                <ShieldCheckIcon className="h-12 w-12 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-slate-900">youAdmin</h2>
            <p className="mt-2 text-sm text-slate-600">Sign in to your admin dashboard</p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Email Address
                </label>
                <div className="relative">
                  <MailIcon className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <LockIcon className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                    disabled={isLoading}
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm text-slate-700">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
                size="lg"
                id="signInButton"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2Icon className="mr-2 h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="w-full"
                disabled={isLoading}
                onClick={() => {
                  if (typeof window !== "undefined" && window.mixpanel) {
                    window.mixpanel.track("Admin SSO Clicked", { provider: "Google" });
                  }
                  setIsLoading(true);
                  setTimeout(() => router.push("/admin/dashboard"), 1500);
                }}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
              <Button
                variant="outline"
                className="w-full"
                disabled={isLoading}
                onClick={() => {
                  if (typeof window !== "undefined" && window.mixpanel) {
                    window.mixpanel.track("Admin SSO Clicked", { provider: "Microsoft" });
                  }
                  setIsLoading(true);
                  setTimeout(() => router.push("/admin/dashboard"), 1500);
                }}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#f25022" d="M1 1h10v10H1z" />
                  <path fill="#00a4ef" d="M13 1h10v10H13z" />
                  <path fill="#7fba00" d="M1 13h10v10H1z" />
                  <path fill="#ffb900" d="M13 13h10v10H13z" />
                </svg>
                Microsoft
              </Button>
            </div>
          </div>

          <p className="text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
              Contact Sales
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
