import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import Nearby from "./pages/Nearby";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Encounters from "./pages/Encounters";
import Likes from "./pages/Likes";
import Chats from "./pages/Chats";
import ChatDetail from "./pages/ChatDetail";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

type SessionState = {
  loading: boolean;
  userId: string | null;
  onboardingComplete: boolean | null; // acts as is_completed flag
};

const useSession = (): SessionState => {
  const [state, setState] = useState<SessionState>({
    loading: true,
    userId: null,
    onboardingComplete: null,
  });

  useEffect(() => {
    let active = true;

    const loadSession = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (!active) return;

      if (error || !data.user) {
        setState({
          loading: false,
          userId: null,
          onboardingComplete: null,
        });
        return;
      }

      const userId = data.user.id;

      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_complete")
        .eq("id", userId)
        .maybeSingle();

      if (!active) return;

      setState({
        loading: false,
        userId,
        onboardingComplete: profile?.onboarding_complete ?? false,
      });
    };

    loadSession();

    return () => {
      active = false;
    };
  }, []);

  return state;
};

// Landing: guests + logged-in (both complete and incomplete) can hit it,
// but completed users get redirected to /encounters as their default.
const LandingRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { loading, userId, onboardingComplete } = useSession();

  useEffect(() => {
    if (loading) return;
    // Logged-in + completed profile: default page is /encounters
    if (userId && onboardingComplete) {
      navigate("/encounters", { replace: true });
    }
  }, [loading, userId, onboardingComplete, navigate]);

  if (loading) return null;
  return <>{children}</>;
};

// Auth: guests and logged-in-but-incomplete can see it;
// logged-in + completed profile should NOT see /auth and go to /encounters.
const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { loading, userId, onboardingComplete } = useSession();

  useEffect(() => {
    if (loading) return;
    if (userId && onboardingComplete) {
      navigate("/encounters", { replace: true });
    }
  }, [loading, userId, onboardingComplete, navigate]);

  if (loading) return null;
  return <>{children}</>;
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { loading, userId } = useSession();

  useEffect(() => {
    if (loading) return;
    if (!userId) {
      navigate("/landing", { replace: true });
    }
  }, [loading, userId, navigate]);

  if (loading || !userId) return null;

  return <>{children}</>;
};

const OnboardingGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { loading, onboardingComplete } = useSession();

  useEffect(() => {
    if (loading) return;
    if (onboardingComplete === false) {
      navigate("/onboarding", { replace: true });
    }
  }, [loading, onboardingComplete, navigate]);

  if (loading) return null;
  if (onboardingComplete === false) return null; // redirecting

  return <>{children}</>;
};

// Onboarding route: only for logged-in users with incomplete profile.
const OnboardingRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { loading, userId, onboardingComplete } = useSession();

  useEffect(() => {
    if (loading) return;
    if (!userId) {
      // Guest hitting onboarding → send to auth.
      navigate("/auth", { replace: true });
      return;
    }
    if (onboardingComplete) {
      // Completed profile shouldn't stay on onboarding.
      navigate("/encounters", { replace: true });
    }
  }, [loading, userId, onboardingComplete, navigate]);

  if (loading) return null;
  if (!userId || onboardingComplete) return null;

  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    {/* DEFAULT / LANDING
        Guests → Landing
        Logged-in incomplete → Landing (can stay here)
        Logged-in complete → redirected to /encounters
    */}
    <Route
      path="/"
      element={
        <LandingRoute>
          <Landing />
        </LandingRoute>
      }
    />
    <Route
      path="/landing"
      element={
        <LandingRoute>
          <Landing />
        </LandingRoute>
      }
    />

    {/* AUTH
        Guests + logged-in incomplete allowed
        Logged-in complete → redirected to /encounters
    */}
    <Route
      path="/auth"
      element={
        <AuthRoute>
          <Auth />
        </AuthRoute>
      }
    />

    {/* ONBOARDING
        Logged-in incomplete only
        Guests → /auth
        Logged-in complete → /encounters
    */}
    <Route
      path="/onboarding"
      element={
        <OnboardingRoute>
          <Onboarding />
        </OnboardingRoute>
      }
    />

    {/* APP: logged-in + completed profile only */}
    <Route
      path="/encounters"
      element={
        <ProtectedRoute>
          <OnboardingGuard>
            <Encounters />
          </OnboardingGuard>
        </ProtectedRoute>
      }
    />
    <Route
      path="/likes"
      element={
        <ProtectedRoute>
          <OnboardingGuard>
            <Likes />
          </OnboardingGuard>
        </ProtectedRoute>
      }
    />
    <Route
      path="/chats"
      element={
        <ProtectedRoute>
          <OnboardingGuard>
            <Chats />
          </OnboardingGuard>
        </ProtectedRoute>
      }
    />
    <Route
      path="/chats/:matchId"
      element={
        <ProtectedRoute>
          <OnboardingGuard>
            <ChatDetail />
          </OnboardingGuard>
        </ProtectedRoute>
      }
    />
    <Route
      path="/profile"
      element={
        <ProtectedRoute>
          <OnboardingGuard>
            <Profile />
          </OnboardingGuard>
        </ProtectedRoute>
      }
    />
    <Route
      path="/edit-profile"
      element={
        <ProtectedRoute>
          <OnboardingGuard>
            <EditProfile />
          </OnboardingGuard>
        </ProtectedRoute>
      }
    />
    <Route
      path="/nearby"
      element={
        <ProtectedRoute>
          <OnboardingGuard>
            <Nearby />
          </OnboardingGuard>
        </ProtectedRoute>
      }
    />

    {/* 404 */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
