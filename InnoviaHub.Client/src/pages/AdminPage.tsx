import { useEffect, useState } from "react";
import type { LoginResponse } from "../../services/authService";
import AdminStatusBadge from "../components/AdminStatusBadge";
import Alert from "../components/Alert";
import MembersAdmin from "../components/MembersAdmin";
import ResourcesAdmin from "../components/ResourcesAdmin";
import { deleteBooking, getAllBookings, type Booking } from "../../services/bookingApiService";
import { getAllResources, type Resource } from "../../services/resourceService";

type AdminTab = "dashboard" | "sensors" | "resources" | "members";

type Sensor = {
  id: string;
  name: string;
  value: string;
  status: string;
  location: string;
  icon: string;
  trend: string;
};

//Hårdkodad data för sensorer
const sensors: Sensor[] = [
  {
    id: "s1",
    name: "Temperatur – Mötesrum A",
    value: "22.4°C",
    status: "ok",
    location: "Rum A",
    icon: "🌡",
    trend: "+0.3°",
  },
  {
    id: "s2",
    name: "Luftkvalitet – Mötesrum B",
    value: "CO₂ 412 ppm",
    status: "ok",
    location: "Rum B",
    icon: "💨",
    trend: "Stabilt",
  },
  {
    id: "s3",
    name: "Rörelse – Coworking zon A",
    value: "Aktiv",
    status: "ok",
    location: "Zon A",
    icon: "👁",
    trend: "9 pers.",
  },
  {
    id: "s4",
    name: "Elförbrukning – AI-server",
    value: "3.8 kWh",
    status: "warn",
    location: "Serverhall",
    icon: "⚡",
    trend: "↑ 12%",
  },
];

const tabs: { id: AdminTab; label: string; icon: string }[] = [
  { id: "dashboard", label: "Översikt", icon: "◈" },
  { id: "sensors", label: "Sensorer", icon: "⚙" },
  { id: "resources", label: "Resurser", icon: "▪" },
  { id: "members", label: "Medlemmar", icon: "◯" },
];

export default function AdminPage({ onBack, user }: { onBack: () => void; user: LoginResponse }) {
  const [tab, setTab] = useState<AdminTab>("dashboard");
  const alertCount = sensors.filter((sensor) => sensor.status !== "ok").length;
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    async function loadBookings() {
      try {
        const [bookings, apiResources] = await Promise.all([
          getAllBookings(),
          getAllResources()
        ]);

        setResources(apiResources.filter((resource) => resource.isActive));

        setRecentBookings(
          bookings
            .filter((booking) => !booking.isCancelled)
            .sort(
              (a, b) =>
                new Date(a.startTime).getTime() -
                new Date(b.startTime).getTime(),
            ),
        );
      } catch (error) {
        setBookingError(
          error instanceof Error ? error.message : "Kunde inte hämta bokningar",
        );
      }
    }

    loadBookings();
  }, []);

  async function handleDeleteBooking(id: string) {
    setBookingToDelete(id);
  }

  async function confirmDeleteBooking() {
    if (!bookingToDelete) return;

    try {
      await deleteBooking(bookingToDelete);
      setRecentBookings((currentBookings) =>
        currentBookings.filter((booking) => booking.id !== bookingToDelete),
      );
      setBookingError(null);
      setBookingToDelete(null);
    } catch (error) {
      setBookingError(
        error instanceof Error ? error.message : "Kunde inte ta bort bokningen",
      );
      setBookingToDelete(null);
    }
  }

  //Räknar ut belänning för bokningar
  const now = new Date();

  const activeBookingCount = recentBookings.filter((booking) => {
    const start = new Date(booking.startTime);
    const end = new Date(booking.endTime);

    return start <= now && end > now;
  }).length

  const today = now.toLocaleDateString("sv-SE");
  const newBookingCount = recentBookings.filter((booking) =>
  new Date(booking.createdAt).toLocaleDateString("sv-SE") === today,).length


// Räknar resurser som har minst en aktiv bokning.
const activeResources = resources.filter((resource) => resource.isActive);

const occupiedResourceIds = new Set(
  recentBookings.map((booking) => booking.resource.id),
);

const occupancyPercentage =
  activeResources.length === 0
    ? 0
    : Math.min(
        100,
        Math.round((occupiedResourceIds.size / activeResources.length) * 100),
      );

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#080e14" }}
    >
      {bookingToDelete && (
        <Alert
          message="Vill du ta bort bokningen?"
          type="confirm"
          onClose={() => setBookingToDelete(null)}
          onConfirm={confirmDeleteBooking}
        />
      )}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-6 py-4"
        style={{
          background: "rgba(8,14,20,0.95)",
          borderBottom: "1px solid #1e3347",
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="text-sm"
            style={{ color: "#7a94aa" }}
          >
            ← Tillbaka
          </button>
          <div className="w-px h-4" style={{ background: "#1e3347" }} />
          <div className="flex items-center gap-2">
            <div
              className="rounded-lg flex items-center justify-center"
              style={{
                width: 32,
                height: 32,
                background: "linear-gradient(135deg, #00d4aa, #0070f3)",
              }}
            >
              ◈
            </div>
            <span
              className="font-bold"
              style={{ fontFamily: "Outfit, sans-serif", color: "#e2eaf2" }}
            >
              Admin
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {alertCount > 0 && (
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{
                background: "rgba(244,63,94,0.1)",
                border: "1px solid rgba(244,63,94,0.25)",
              }}
            >
              <div
                className="pulse-dot w-2 h-2 rounded-full"
                style={{ background: "#f43f5e" }}
              />
              <span className="text-xs mono" style={{ color: "#f43f5e" }}>
                {alertCount} larm aktiva
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                background: "linear-gradient(135deg, #00d4aa33, #3b82f633)",
                color: "#00d4aa",
                border: "1px solid #1e3347",
              }}
            >
                {user.firstName[0]}{user.lastName[0]}
            </div>
            <span
              className="text-sm hidden md:block"
              style={{ color: "#e2eaf2" }}
            >
              {user.firstName} {user.lastName}
            </span>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside
          className="hidden md:flex flex-col w-52 shrink-0 pt-6 px-3"
          style={{ borderRight: "1px solid #1e3347" }}
        >
          <AdminNavigation
            tab={tab}
            onTabChange={setTab}
            alertCount={alertCount}
          />
          <div className="mt-auto pb-6 px-3">
            <div
              className="rounded-xl p-3"
              style={{ background: "#111e2d", border: "1px solid #1e3347" }}
            >
              <div className="text-xs mono mb-1" style={{ color: "#7a94aa" }}>
                Systemstatus
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="pulse-dot w-2 h-2 rounded-full"
                  style={{ background: "#00d4aa" }}
                />
                <span className="text-xs" style={{ color: "#00d4aa" }}>
                  Alla system online
                </span>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-6 overflow-auto">
          <div className="flex gap-2 mb-6 md:hidden flex-wrap">
            <AdminNavigation
              tab={tab}
              onTabChange={setTab}
              alertCount={alertCount}
              mobile
            />
          </div>
          {tab === "dashboard" && (
            <DashboardView
              alerts={alertCount}
              recentBookings={recentBookings}
              bookingError={bookingError}
              onDeleteBooking={handleDeleteBooking}
              onClearBookingError={() => setBookingError(null)}
              activeBookingCount={activeBookingCount}
              newBookingCount={newBookingCount}
              occupancyPercentage={occupancyPercentage}
            />
          )}
          {tab === "sensors" && <SensorsView />}
          {tab === "resources" && <ResourcesAdmin />}
          {tab === "members" && <MembersAdmin />}
        </main>
      </div>
    </div>
  );
}

function AdminNavigation({
  tab,
  onTabChange,
  alertCount,
  mobile = false,
}: {
  tab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  alertCount: number;
  mobile?: boolean;
}) {
  return (
    <nav className={mobile ? "flex gap-2 flex-wrap" : "space-y-1"}>
      {tabs.map((item) => (
        <button
          key={item.id}
          onClick={() => onTabChange(item.id)}
          className={
            mobile
              ? "px-3 py-1.5 rounded-lg text-xs font-medium"
              : "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium"
          }
          style={{
            background:
              tab === item.id
                ? mobile
                  ? "#00d4aa"
                  : "rgba(0,212,170,0.1)"
                : mobile
                  ? "#111e2d"
                  : "transparent",
            color:
              tab === item.id ? (mobile ? "#080e14" : "#00d4aa") : "#7a94aa",
            border: `1px solid ${tab === item.id ? "#00d4aa" : "#1e3347"}`,
            fontFamily: "Outfit, sans-serif",
          }}
        >
          <span>{item.icon}</span>
          {item.label}
          {item.id === "sensors" && alertCount > 0 && (
            <span
              className="ml-auto rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold"
              style={{ background: "#f43f5e", color: "white" }}
            >
              {alertCount}
            </span>
          )}
        </button>
      ))}
    </nav>
  );
}

function DashboardView({
  alerts,
  recentBookings,
  bookingError,
  onDeleteBooking,
  onClearBookingError,
  activeBookingCount,
  newBookingCount,
  occupancyPercentage,
}: {
  alerts: number;
  recentBookings: Booking[];
  bookingError: string | null;
  onDeleteBooking: (id: string) => void;
  onClearBookingError: () => void;
  activeBookingCount: number;
  newBookingCount: number;
  occupancyPercentage: number;
}) {
  return (
    <div className="space-y-6">
      <h1
        className="text-2xl font-bold"
        style={{ fontFamily: "Outfit, sans-serif", color: "#e2eaf2" }}
      >
        Översikt
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: "Beläggning",
            value: `${occupancyPercentage}%`,
            sub: "av total kapacitet",
            color: "#00d4aa",
          },
          {
            label: "Aktiva bokningar",
            value: String(activeBookingCount),
            sub: "just nu",
            color: "#3b82f6",
          },
          {
            label: "Aktiva larm",
            value: String(alerts),
            sub: "sensorer kräver åtgärd",
            color: alerts ? "#f43f5e" : "#00d4aa",
          },
          {
            label: "Nya idag",
            value: String(newBookingCount),
            sub: "bokningar skapade",
            color: "#a855f7",
          },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl p-5"
            style={{ background: "#0d1824", border: "1px solid #1e3347" }}
          >
            <div className="mono text-2xl mb-1" style={{ color: kpi.color }}>
              {kpi.value}
            </div>
            <div className="text-sm font-semibold" style={{ color: "#e2eaf2" }}>
              {kpi.label}
            </div>
            <div className="text-xs" style={{ color: "#7a94aa" }}>
              {kpi.sub}
            </div>
          </div>
        ))}
      </div>
      <div
        className="rounded-xl p-5"
        style={{ background: "#0d1824", border: "1px solid #1e3347" }}
      >
        <h3 className="font-bold mb-4" style={{ color: "#e2eaf2" }}>
          Aktiva bokningar
        </h3>
        {bookingError && (
          <Alert
            message={bookingError}
            type="error"
            onClose={onClearBookingError}
          />
        )}
        {recentBookings.map((booking) => (
          <div
            key={booking.id}
            className="flex items-center justify-between gap-4 py-3"
            style={{ borderBottom: "1px solid #1e3347" }}
          >
            <div>
              <span className="text-sm font-medium" style={{ color: "#e2eaf2" }}>
                {booking.resource.name}
              </span>
              <span className="text-sm mx-2" style={{ color: "#1e3347" }}>
                ·
              </span>
              <span className="text-sm" style={{ color: "#7a94aa" }}>
                {booking.user.firstName} {booking.user.lastName}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="mono text-xs" style={{ color: "#7a94aa" }}>
                Tid: {""}
                {new Date(booking.startTime).toLocaleTimeString("sv-SE", {
                  hour: "2-digit",
                  minute: "2-digit"
                })}
                –
                {new Date(booking.endTime).toLocaleTimeString("sv-SE", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <span className="mono text-xs" style={{ color: "#7a94aa" }}>
                Datum: {""}
                {new Date(booking.startTime).toLocaleDateString("sv-SE")}
              </span>
              <button
                onClick={() => onDeleteBooking(booking.id)}
                className="text-xs px-3 py-2 rounded-lg"
                style={{
                  background: "rgba(244,63,94,0.1)",
                  color: "#f43f5e",
                  border: "1px solid rgba(244,63,94,0.25)",
                  cursor: "pointer",
                }}
              >
                Ta bort
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SensorsView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1
          className="text-2xl font-bold"
          style={{ fontFamily: "Outfit, sans-serif", color: "#e2eaf2" }}
        >
          Sensorövervakning
        </h1>
        <span className="text-xs mono" style={{ color: "#7a94aa" }}>
          Realtid · 5s uppdatering
        </span>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {sensors.map((sensor) => (
          <div
            key={sensor.id}
            className="rounded-xl p-4"
            style={{ background: "#0d1824", border: "1px solid #1e3347" }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="rounded-lg flex items-center justify-center text-xl"
                  style={{
                    width: 40,
                    height: 40,
                    background: "rgba(0,212,170,0.1)",
                  }}
                >
                  {sensor.icon}
                </div>
                <div>
                  <div
                    className="text-sm font-semibold"
                    style={{ color: "#e2eaf2" }}
                  >
                    {sensor.name}
                  </div>
                  <div className="text-xs" style={{ color: "#7a94aa" }}>
                    {sensor.location}
                  </div>
                </div>
              </div>
              <AdminStatusBadge status={sensor.status} />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span
                className="mono text-xl"
                style={{
                  color: sensor.status === "warn" ? "#f59e0b" : "#00d4aa",
                }}
              >
                {sensor.value}
              </span>
              <span className="text-xs" style={{ color: "#7a94aa" }}>
                {sensor.trend}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
