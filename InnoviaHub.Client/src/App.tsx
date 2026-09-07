import { useState } from "react";
import LandingPage from "./pages/LandingPage";
import BookingPage from "./pages/BookingPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import BottomNav, { type View } from "./components/BottomNav";
import { logout } from "../services/authService";

export default function App() {
  const [view, setView] = useState<View>("login");

  async function handleLogout() {
    try {
      await logout();
    } finally {
      setView("login");
    }
  }

  return (
      <div className="min-h-screen" style={{ background: "#080e14" }}>
        {view !== "login" && (
          <BottomNav currentView={view} onNavigate={setView} onLogout={handleLogout} />
        )}
            {view === "landing" && <LandingPage onBook={() => setView("booking")} />}
            {view === "booking" && <BookingPage onAdmin={() => setView("admin")} />}
            {view === "admin" && <AdminPage onBack={() => setView("landing")} />}
            {view === "login" && (
              <LoginPage
                onLogin={(user) => setView(user.isAdmin ? "admin" : "booking")}
              />
            )}
      </div>
  );
}
