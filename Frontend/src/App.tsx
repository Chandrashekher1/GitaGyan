import { Suspense, lazy } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { Header } from "./components/Header";
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
const Yoga = lazy(() => import("./features/yoga/YogaPage"));

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
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/chapters" element={<Chapters />} />
                  <Route path="/verses" element={<Verses />} />
                  <Route path="/verses/:chapterNumber" element={<Verses />} />
                  <Route path="/meditation" element={<Meditation />} />
                  <Route path="/yoga" element={<Yoga />} />
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
