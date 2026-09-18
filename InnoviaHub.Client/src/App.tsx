import { useEffect, useState } from "react";
import LandingPage from "./pages/LandingPage";
import BookingPage from "./pages/BookingPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import BottomNav, { type View } from "./components/BottomNav";
import ChangePasswordModal from "./components/ChangePasswordModal";
import { getCurrentUser, logout, type LoginResponse } from "./services/authService";

export default function App() {
  const [view, setView] = useState<View>("login");
  const [user, setUser] = useState<LoginResponse | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((currentUser) => {
        setUser(currentUser);
        setView(currentUser ? currentUser.isAdmin ? "admin" : "booking" : "login");
      })
      .catch(() => {
        setUser(null);
        setView("login");
      })
      .finally(() => setIsLoadingUser(false));
  }, []);

  async function handleLogout() {
    try {
      await logout();
    } finally {
      setUser(null);
      setView("login");
    }
  }

  function handleNavigate(nextView: View) {
    if (nextView === "admin" && !user?.isAdmin) {
      setView("booking");
      return;
    }

    setView(nextView);
  }

  function handlePasswordChanged() {
    setUser((currentUser) => currentUser ? { ...currentUser, mustChangePassword: false } : null);
  }

  if (isLoadingUser) {
    return <div className="min-h-screen" style={{ background: "#080e14" }} />;
  }

  return (
      <div className="min-h-screen" style={{ background: "#080e14" }}>
        {view !== "login" && (
          <BottomNav
            currentView={view}
            isAdmin={user?.isAdmin === true}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        )}
            {view === "landing" && <LandingPage user={user} onBook={() => setView("booking")} />}
            {view === "booking" && <BookingPage user={user} />}
            {view === "admin" && user?.isAdmin && <AdminPage user={user} onBack={() => setView("landing")} />}
            {view === "login" && (
              <LoginPage
                onLogin={(loggedInUser) => {
                  setUser(loggedInUser);
                  setView(loggedInUser.isAdmin ? "admin" : "booking");
                }}
              />
            )}
            {user?.mustChangePassword && <ChangePasswordModal onChanged={handlePasswordChanged} onLogout={handleLogout} />}
      </div>
  );
}
