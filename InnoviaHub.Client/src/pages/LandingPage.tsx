import { useState, useEffect} from "react";
import type { LoginResponse } from "../services/authService";
import UserAvatar from "../components/UserAvatar";
import { getAllUsers } from "../services/userService";
import { getAllBookings, type Booking } from "../services/bookingApiService";
import { getAllResources, type Resource } from "../services/resourceService";
import { connection, startNotificationConnection } from "../services/notificationService";

export function LiveDot({ color = "#00d4aa" }: { color?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="pulse-dot inline-block rounded-full"
        style={{ width: 7, height: 7, background: color }}
      />
    </span>
  );
}

export default function LandingPage({ onBook, user }: { onBook: () => void; user: LoginResponse | null }) {
  const [tick, setTick] = useState(0);
  const [memberCount, setMemberCount] = useState<number | null>(null);
  const [occupancy, setOccupancy] = useState<number | null>(null);
  const [resourceCards, setResourceCards] = useState<{label: string, total: number, booked: number, icon: string, color: string }[]>([]);
  const [dataVersion, setDataVersion] = useState(0)
  const [myBookings, setMyBookings] = useState<Booking[]>([]);

  const stats = [
  ...(user?.isAdmin ? [{ value: memberCount === null ? "..." : String(memberCount), label: "Aktiva medlemmar" }] : []),
  { value: occupancy === null ? "..." : `${occupancy}%`, label: "Beläggning idag"},
  { value: "12 ms", label: "API-svarstid" },
  { value: "23°C", label: "Snitttemperatur" },
];

  useEffect(() => {
    async function loadStats() {
      const [bookings, resources, users] = await Promise.all([
        getAllBookings(),
        getAllResources(),
        user?.isAdmin ? getAllUsers() : Promise.resolve(null),
      ]);

      if (users) {
        setMemberCount(users.length);
      }

      const userBookings = bookings.filter((booking) =>
      booking.user.id === user?.userId && !booking.isCancelled && 
      new Date(booking.endTime) >= new Date()).sort((a, b) => 
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
      
      setMyBookings(userBookings);

      const activeResources = resources.filter((resource) => resource.isActive);
      const now = new Date();

      const activeBookings = bookings.filter((booking) => {
        if (booking.isCancelled) return false;

        const start = new Date(booking.startTime)
        const end = new Date(booking.endTime)

        return (
        start <= now && now < end
      );
      });

      const occupiedResourceIds = new Set(
        activeBookings.map((booking) => booking.resource.id),
      );

      const groupedResources = new Map<string, Resource[]>();
      activeResources.forEach((resource) => {
        const typeName = resource.resourceType.name;
        const group = groupedResources.get(typeName) ?? [];

        group.push(resource);
        groupedResources.set(typeName, group);
      });

      setResourceCards(
        Array.from(groupedResources.entries()).map(([label, group]) => {
          const resourceIds = new Set(
            group.map((resource) => resource.id)
          );

          const booked = Array.from(occupiedResourceIds).filter((id) => 
          resourceIds.has(id)).length;

          return {
            label, 
            total: group.length,
            booked, 
            icon: "▪",
            color: "#00d4aa"
          }
        })
      )

      setOccupancy(activeResources.length === 0 ? 0 : Math.round((occupiedResourceIds.size / activeResources.length) * 100))
    }
    loadStats().catch(console.error)
  }, [dataVersion, user?.isAdmin, user?.userId])

  useEffect(() => {
    function handleBookingCreated() {
      setDataVersion((version) => version + 1);
    }

    connection.on("BookingCreated", handleBookingCreated);

    startNotificationConnection().catch((error) => {
      console.error("Kunde inte ansluta till signalR", error)
    });

    return () => {
      connection.off("BookingCreated", handleBookingCreated)
    };
  }, [])

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 3000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setDataVersion((version) => version + 1);
    }, 30_000);
    return () => window.clearInterval(id)
  }, []);

  const hour = new Date().toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="min-h-screen grid-bg" style={{ background: "#080e14" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-6 py-4"
        style={{
          background: "rgba(8,14,20,0.9)",
          borderBottom: "1px solid #1e3347",
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="flex items-center gap-3">
            <div
                className="rounded-lg flex items-center justify-center"
                style={{ width: 36, height: 36, background: "linear-gradient(135deg, #00d4aa, #0070f3)" }}
            >
                <span style={{ fontSize: 18 }}>◈</span>
            </div>
            <span className="text-xl font-bold" style={{ fontFamily: "Outfit, sans-serif", color: "#e2eaf2" }}>
            Innovia<span style={{ color: "#00d4aa" }}>Hub</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <UserAvatar user={user} />
          <span className="text-sm hidden sm:block" style={{ color: "#7a94aa" }}>
            Inloggad som <span style={{ color: "#e2eaf2" }}>{user?.firstName} {user?.lastName}</span>
          </span>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: "#0d1824", border: "1px solid #1e3347" }}>
            <LiveDot />
            <span className="mono text-xs" style={{ color: "#7a94aa" }}>{hour}</span>
          </div>
          <button
            onClick={onBook}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150"
            style={{
              background: "#00d4aa",
              color: "#080e14",
              fontFamily: "Outfit, sans-serif",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#00f0c4")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#00d4aa")}
          >
            Boka nu
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-20 pb-16 md:pt-28 md:pb-24 max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold"
        style={{color: "#00d4aa", fontFamily: "Outfit, sans-serif"}}>
          Välkommen, {user?.firstName}!
        </h1>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(0,212,170,0.08) 0%, transparent 70%)",
          }}
        />
      </section>

      {/* Live stats */}
      <section className="px-6 pb-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((s, i) => (
            <div
              key={i}
              className="rounded-xl p-5 transition-all duration-200"
              style={{
                background: "#0d1824",
                border: "1px solid #1e3347",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#2a4a64")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e3347")}
            >
              <div className="mono text-2xl font-medium mb-1" style={{ color: "#00d4aa" }}>{s.value}</div>
              <div className="text-sm font-medium mb-1" style={{ color: "#e2eaf2", fontFamily: "Outfit, sans-serif" }}>{s.label}</div>
              <div className="text-xs" style={{ color: "#7a94aa" }}></div>
            </div>
          ))}
        </div>
      </section>

      {/* Resource status */}
      <section className="px-6 pb-12 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ fontFamily: "Outfit, sans-serif", color: "#e2eaf2" }} >
            Resursstatus 
          </h2>
          <div className="flex items-center gap-2">
          <LiveDot/>
          <span className="text-xs mono" style={{color: "#7a94aa"}}>Realtidsuppdatering aktiv, uppdaterar var 30s</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {resourceCards.map((r, i) => {
            const pct = Math.round((r.booked / r.total) * 100);
            const free = r.total - r.booked;
            const pulseOffset = ((tick + i) % 5) - 2;
            const visualPct = tick % 2 === 0 ? pct : Math.min(100, Math.max(0, pct + pulseOffset));

            return (
              <div
                key={i}
                className="rounded-xl p-5 transition-all duration-200"
                style={{ background: "#0d1824", border: "1px solid #1e3347" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = r.color + "55")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e3347")}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="rounded-lg flex items-center justify-center text-lg"
                      style={{ width: 40, height: 40, background: r.color + "18", color: r.color }}
                    >
                      {r.icon}
                    </div>
                    <div>
                      <div className="font-semibold" style={{ fontFamily: "Outfit, sans-serif", color: "#e2eaf2" }}>{r.label}</div>
                      <div className="text-xs mono" style={{ color: "#7a94aa" }}>{r.total} totalt</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className="inline-block px-2 py-0.5 rounded-full text-xs font-medium mono"
                      style={{
                        background: free > 0 ? "rgba(0,212,170,0.1)" : "rgba(244,63,94,0.1)",
                        color: free > 0 ? "#00d4aa" : "#f43f5e",
                        border: `1px solid ${free > 0 ? "rgba(0,212,170,0.25)" : "rgba(244,63,94,0.25)"}`,
                      }}
                    >
                      {free > 0 ? `${free} lediga` : "Fullbokad"}
                    </span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs" style={{ color: "#7a94aa" }}>
                    <span>{r.booked} bokade</span>
                    <span className="mono">{pct}%</span>
                  </div>
                  <div className="rounded-full overflow-hidden" style={{ height: 6, background: "#1e3347" }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${visualPct}%`,
                        background: `linear-gradient(90deg, ${r.color}, ${r.color}bb)`,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

        <section className="px-6 pb-20 max-w-6xl mx-auto">
        {/* Bokningar */}
        <div
            className="w-full rounded-xl p-5"
            style={{ background: "#0d1824", border: "1px solid #1e3347" }}
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold" style={{ fontFamily: "Outfit, sans-serif", color: "#e2eaf2" }}>Mina bokningar</h3>
          </div>
          <div className="space-y-3">
            {myBookings.length === 0 ? (
              <p className="text-sm" style={{color: "#7a94aa"}}>
                Du har inga kommande bokningar
              </p>
            ) : (
              myBookings.map((booking) => (
                <div key={booking.id} className="flex items-start gap-3">
                  <span className="mono text-xs shrink-0 mt-0.5"
                  style={{color: "#7a94aa", width: 130}}>
                    {new Date(booking.startTime).toLocaleString("sv-SE", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                  style={{background: "#00d4aa"}}></div>
                    <span className="text-sm" style={{color: "#c4d4e0"}}>
                      {booking.resource.name}
                    </span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer
        className="px-6 py-8 max-w-6xl mx-auto"
        style={{ borderTop: "1px solid #1e3347" }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <span style={{ fontFamily: "Outfit, sans-serif", color: "#7a94aa", fontSize: 14 }}>
            © 2026 Innovia Hub
          </span>
        </div>
      </footer>
    </div>
  );
}