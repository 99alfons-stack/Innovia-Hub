import { useState } from "react";
import LandingPage from "./pages/LandingPage";
import BookingPage from "./pages/BookingPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";

type View = "landing" | "booking" | "admin" | "login";

export default function App() {
  const [view, setView] = useState<View>("login");

  return (
      <div className="min-h-screen" style={{ background: "#080e14" }}>
        {/* Dev nav */}
        {view !== "login" && <nav
            className="fixed bottom-6 left-1/2 z-50 flex gap-1 rounded-full px-2 py-2"
            style={{
              transform: "translateX(-50%)",
              background: "rgba(13,24,36,0.95)",
              border: "1px solid #1e3347",
              backdropFilter: "blur(12px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            }}
        >
          {(
              [
                { id: "landing", label: "Landingssida" },
                { id: "booking", label: "Bokningssystem" },
                { id: "admin", label: "Adminpanel" },
                { id: "login", label:"Log in"}
              ] as { id: View; label: string }[]
          ).map(({ id, label }) => (
              <button
                  key={id}
                  onClick={() => setView(id)}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
                  style={{
                    fontFamily: "Outfit, sans-serif",
                    background: view === id ? "#00d4aa" : "transparent",
                    color: view === id ? "#080e14" : "#7a94aa",
                  }}
              >
                {label}
              </button>
          ))}
        </nav>}
            {view === "landing" && <LandingPage onBook={() => setView("booking")} />}
            {view === "booking" && <BookingPage onAdmin={() => setView("admin")} />}
            {view === "admin" && <AdminPage onBack={() => setView("landing")} />}
            {view === "login" && <LoginPage onBack={() => setView("landing")} />}
      </div>
  );
}
