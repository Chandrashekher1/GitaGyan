import { Suspense, lazy } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { Header } from "./components/Header";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LanguageProvider } from "./context/Language";
import { Toaster } from "sonner";
import { Home } from "./pages/Home";

const Chat = lazy(() => import("./pages/Chat").then((module) => ({ default: module.Chat })));
const Login = lazy(() => import("./pages/Login").then((module) => ({ default: module.Login })));
const SignUp = lazy(() => import("./pages/SignUp").then((module) => ({ default: module.SignUp })));
const About = lazy(() => import("./pages/About"));
const Chapters = lazy(() => import("./pages/Chapters"));
const Verses = lazy(() => import("./pages/Verses"));
const Meditation = lazy(() => import("./pages/Meditations"));
const Profile = lazy(() => import("./pages/Profile"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const Yoga = lazy(() => import("./features/yoga/YogaPage"));

// Check-in Feature
const MoodSelection = lazy(() => import("./features/checkin/MoodSelection").then(m => ({ default: m.MoodSelection })));
const AdaptiveSurvey = lazy(() => import("./features/checkin/AdaptiveSurvey").then(m => ({ default: m.AdaptiveSurvey })));
const MoodResult = lazy(() => import("./features/checkin/MoodResult").then(m => ({ default: m.MoodResult })));

function RouteLoader() {
  return (
    <div className="px-4 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-center py-12">
        <div className="flex items-center gap-3 rounded-full border border-border/70 bg-background/90 px-5 py-3 shadow-sm backdrop-blur">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary/25 border-t-primary" />
          <p className="text-sm text-muted-foreground">Loading the next space...</p>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <LanguageProvider>
        <Router>
          <div className="relative z-10">
            <Header />
            <main className="pb-10">
              <Suspense fallback={<RouteLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/chapters" element={<ProtectedRoute><Chapters /></ProtectedRoute>} />
                  <Route path="/verses" element={<ProtectedRoute><Verses /></ProtectedRoute>} />
                  <Route path="/verses/:chapterNumber" element={<ProtectedRoute><Verses /></ProtectedRoute>} />
                  <Route path="/meditation" element={<ProtectedRoute><Meditation /></ProtectedRoute>} />
                  <Route path="/yoga" element={<ProtectedRoute><Yoga /></ProtectedRoute>} />

                  <Route path="/check-in" element={<ProtectedRoute><MoodSelection /></ProtectedRoute>} />
                  <Route path="/check-in/survey" element={<ProtectedRoute><AdaptiveSurvey /></ProtectedRoute>} />
                  <Route path="/check-in/result" element={<ProtectedRoute><MoodResult /></ProtectedRoute>} />
                </Routes>
              </Suspense>
            </main>
            <Toaster duration={5000} position="top-center" richColors />
          </div>
        </Router>
      </LanguageProvider>
    </div>
  );
}

export default App;
