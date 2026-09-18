import { useEffect, useState } from "react";
import type { LoginResponse } from "../services/authService";
import Alert from "../components/Alert";
import AdminDashboard from "../components/AdminDashboard";
import AdminNavigation from "../components/AdminNavigation";
import AdminSensors from "../components/AdminSensors";
import MembersAdmin from "../components/MembersAdmin";
import ResourcesAdmin from "../components/ResourcesAdmin";
import { sensors, type AdminTab } from "../components/adminData";
import { deleteBooking, getAllBookings, type Booking } from "../services/bookingApiService";
import { getAllResources, type Resource } from "../services/resourceService";

export default function AdminPage({ onBack, user }: { onBack: () => void; user: LoginResponse }) {
  const [tab, setTab] = useState<AdminTab>("dashboard");
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const alertCount = sensors.filter((sensor) => sensor.status !== "ok").length;

  useEffect(() => {
    async function loadBookings() {
      try {
        const [bookings, apiResources] = await Promise.all([getAllBookings(), getAllResources()]);
        setResources(apiResources.filter((resource) => resource.isActive));
        setRecentBookings(
          bookings
            .filter((booking) => !booking.isCancelled)
            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()),
        );
      } catch (error) {
        setBookingError(error instanceof Error ? error.message : "Kunde inte hämta bokningar");
      }
    }

    loadBookings();
  }, []);

  async function confirmDeleteBooking() {
    if (!bookingToDelete) return;

    try {
      await deleteBooking(bookingToDelete);
      setRecentBookings((currentBookings) => currentBookings.filter((booking) => booking.id !== bookingToDelete));
      setBookingError(null);
    } catch (error) {
      setBookingError(error instanceof Error ? error.message : "Kunde inte ta bort bokningen");
    } finally {
      setBookingToDelete(null);
    }
  }

  const now = new Date();
  const activeBookingCount = recentBookings.filter((booking) => {
    const start = new Date(booking.startTime);
    const end = new Date(booking.endTime);
    return start <= now && end > now;
  }).length;
  const today = now.toLocaleDateString("sv-SE");
  const newBookingCount = recentBookings.filter(
    (booking) => new Date(booking.createdAt).toLocaleDateString("sv-SE") === today,
  ).length;
  const occupiedResourceIds = new Set(recentBookings.map((booking) => booking.resource.id));
  const occupancyPercentage = resources.length === 0
    ? 0
    : Math.min(100, Math.round((occupiedResourceIds.size / resources.length) * 100));

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#080e14" }}>
      {bookingToDelete && (
        <Alert
          message="Vill du ta bort bokningen?"
          type="confirm"
          onClose={() => setBookingToDelete(null)}
          onConfirm={confirmDeleteBooking}
        />
      )}
      <AdminHeader onBack={onBack} user={user} alertCount={alertCount} />
      <div className="flex flex-1">
        <aside className="hidden md:flex flex-col w-52 shrink-0 pt-6 px-3" style={{ borderRight: "1px solid #1e3347" }}>
          <AdminNavigation tab={tab} onTabChange={setTab} alertCount={alertCount} />
          <SystemStatus />
        </aside>
        <main className="flex-1 p-6 overflow-auto">
          <div className="flex gap-2 mb-6 md:hidden flex-wrap">
            <AdminNavigation tab={tab} onTabChange={setTab} alertCount={alertCount} mobile />
          </div>
          {tab === "dashboard" && (
            <AdminDashboard
              alerts={alertCount}
              recentBookings={recentBookings}
              bookingError={bookingError}
              onDeleteBooking={setBookingToDelete}
              onClearBookingError={() => setBookingError(null)}
              activeBookingCount={activeBookingCount}
              newBookingCount={newBookingCount}
              occupancyPercentage={occupancyPercentage}
            />
          )}
          {tab === "sensors" && <AdminSensors />}
          {tab === "resources" && <ResourcesAdmin />}
          {tab === "members" && <MembersAdmin />}
        </main>
      </div>
    </div>
  );
}

function AdminHeader({ onBack, user, alertCount }: { onBack: () => void; user: LoginResponse; alertCount: number }) {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4" style={{ background: "rgba(8,14,20,0.95)", borderBottom: "1px solid #1e3347", backdropFilter: "blur(16px)" }}>
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="text-sm" style={{ color: "#7a94aa" }}>← Tillbaka</button>
        <div className="w-px h-4" style={{ background: "#1e3347" }} />
        <div className="flex items-center gap-2">
          <div className="rounded-lg flex items-center justify-center" style={{ width: 32, height: 32, background: "linear-gradient(135deg, #00d4aa, #0070f3)" }}>◈</div>
          <span className="font-bold" style={{ fontFamily: "Outfit, sans-serif", color: "#e2eaf2" }}>Admin</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {alertCount > 0 && <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.25)" }}><div className="pulse-dot w-2 h-2 rounded-full" style={{ background: "#f43f5e" }} /><span className="text-xs mono" style={{ color: "#f43f5e" }}>{alertCount} larm aktiva</span></div>}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "linear-gradient(135deg, #00d4aa33, #3b82f633)", color: "#00d4aa", border: "1px solid #1e3347" }}>{user.firstName[0]}{user.lastName[0]}</div>
          <span className="text-sm hidden md:block" style={{ color: "#e2eaf2" }}>{user.firstName} {user.lastName}</span>
        </div>
      </div>
    </header>
  );
}

function SystemStatus() {
  return (
    <div className="mt-auto pb-6 px-3">
      <div className="rounded-xl p-3" style={{ background: "#111e2d", border: "1px solid #1e3347" }}>
        <div className="text-xs mono mb-1" style={{ color: "#7a94aa" }}>Systemstatus</div>
        <div className="flex items-center gap-2"><div className="pulse-dot w-2 h-2 rounded-full" style={{ background: "#00d4aa" }} /><span className="text-xs" style={{ color: "#00d4aa" }}>Alla system online</span></div>
      </div>
    </div>
  );
}