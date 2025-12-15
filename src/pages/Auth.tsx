import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Mail, Phone, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

type AuthView = "initial" | "email" | "password";
type AuthMode = "login" | "signup";

const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

const Auth = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<AuthView>("initial");
  const [mode, setMode] = useState<AuthMode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailContinue = () => {
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      toast({
        title: "Invalid email",
        description: result.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }
    setView("password");
  };

  const checkOnboardingAndRedirect = async (userId: string) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_complete')
      .eq('id', userId)
      .maybeSingle();
    
    if (profile?.onboarding_complete) {
      navigate("/app");
    } else {
      navigate("/onboarding");
    }
  };

  const handleSubmit = async () => {
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      toast({
        title: "Invalid password",
        description: passwordResult.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        const redirectUrl = `${window.location.origin}/onboarding`;
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
          },
        });
        if (error) throw error;
        
        // If email confirmation is disabled, redirect to onboarding
        if (data.user && data.session) {
          navigate("/onboarding");
        } else {
          toast({
            title: "Account created!",
            description: "Please check your email to verify your account.",
          });
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        // Check if onboarding is complete
        if (data.user) {
          await checkOnboardingAndRedirect(data.user.id);
        }
      }
    } catch (error: any) {
      toast({
        title: "Authentication error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/onboarding`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Google sign in failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (view === "password") {
      setView("email");
    } else if (view === "email") {
      setView("initial");
    }
  };

  // Initial sign-in screen
  if (view === "initial") {
    return (
      <div className="min-h-screen bg-violet-50 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          {/* Logo */}
          <div className="mb-8">
            <span className="text-4xl font-rounded font-extrabold text-rose-500 lowercase">
              kora
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
            Here's to dating with confidence
          </h1>

          {/* Sign in options */}
          <div className="w-full max-w-sm space-y-3">
            <Button
              onClick={() => {
                setMode("login");
                setView("email");
              }}
              className="w-full h-12 bg-foreground text-primary-foreground hover:bg-foreground/90 rounded-full"
            >
              Quick sign in
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setMode("signup");
                setView("email");
              }}
              className="w-full h-12 rounded-full border-foreground/20 bg-card hover:bg-card/80 gap-2"
            >
              <Mail className="w-5 h-5" />
              Continue with email
            </Button>

            <Button
              variant="outline"
              className="w-full h-12 rounded-full border-foreground/20 bg-card hover:bg-card/80 gap-2"
            >
              <Phone className="w-5 h-5" />
              Continue with phone
            </Button>

            <Button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full h-12 bg-foreground text-primary-foreground hover:bg-foreground/90 rounded-full gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
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
              Continue with Google
            </Button>
          </div>

          {/* Privacy disclaimer */}
          <p className="text-muted-foreground text-sm text-center mt-8 max-w-xs">
            We'll never share anything without your permission
          </p>
        </div>

        {/* Footer links */}
        <div className="px-6 py-8">
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground mb-4">
            <button className="hover:underline">Manage Cookies</button>
            <button className="hover:underline">Help</button>
            <button className="hover:underline">Safety centre</button>
          </div>
          <p className="text-xs text-muted-foreground text-center max-w-sm mx-auto">
            By tapping to continue, you are agreeing to our{" "}
            <button className="underline">Terms and Conditions</button>. Find out
            about how we process your data in our{" "}
            <button className="underline">Privacy Policy</button> and{" "}
            <button className="underline">Cookie Policy</button>.
          </p>
        </div>
      </div>
    );
  }

  // Email entry screen
  if (view === "email") {
    return (
      <div className="min-h-screen bg-violet-50 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-md bg-card rounded-3xl p-8 shadow-sm">
          {/* Back button */}
          <button
            onClick={handleBack}
            className="mb-6 p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>

          {/* Heading */}
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Got it. Next, what's your email?
          </h1>
          <p className="text-muted-foreground mb-8">
            This is so you can verify your account
          </p>

          {/* Email input */}
          <div className="space-y-2 mb-6">
            <Label htmlFor="email" className="text-foreground">
              Your email address
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="h-12 rounded-xl bg-input border-border"
              onKeyDown={(e) => e.key === "Enter" && handleEmailContinue()}
            />
          </div>

          {/* Alternative option */}
          <button className="text-sm text-muted-foreground hover:underline mb-8">
            Sign up with mobile number instead
          </button>

          {/* Privacy disclaimer */}
          <div className="flex items-start gap-2 text-xs text-muted-foreground mb-8">
            <Lock className="w-4 h-4 mt-0.5 shrink-0" />
            <p>
              We'll never share anything without your permission. By continuing,
              you agree to our Terms and Privacy Policy.
            </p>
          </div>

          {/* Continue button */}
          <Button
            onClick={handleEmailContinue}
            className="w-full h-12 bg-foreground text-primary-foreground hover:bg-foreground/90 rounded-full"
          >
            Continue
          </Button>
        </div>
      </div>
    );
  }

  // Password entry screen
  return (
    <div className="min-h-screen bg-violet-50 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md bg-card rounded-3xl p-8 shadow-sm">
        {/* Back button */}
        <button
          onClick={handleBack}
          className="mb-6 p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {mode === "login" ? "Welcome back!" : "Create a password"}
        </h1>
        <p className="text-muted-foreground mb-8">
          {mode === "login"
            ? "Enter your password to sign in"
            : "Choose a strong password with at least 6 characters"}
        </p>

        {/* Password input */}
        <div className="space-y-2 mb-4">
          <Label htmlFor="password" className="text-foreground">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="h-12 rounded-xl bg-input border-border"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>

        {/* Forgot password link */}
        {mode === "login" && (
          <button className="text-sm text-muted-foreground hover:underline mb-8 block">
            Forgot password?
          </button>
        )}

        {/* Toggle mode */}
        <p className="text-sm text-muted-foreground mb-8">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                onClick={() => setMode("signup")}
                className="text-foreground hover:underline font-medium"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-foreground hover:underline font-medium"
              >
                Sign in
              </button>
            </>
          )}
        </p>

        {/* Submit button */}
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full h-12 bg-foreground text-primary-foreground hover:bg-foreground/90 rounded-full"
        >
          {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
        </Button>
      </div>
    </div>
  );
};

export default Auth;
