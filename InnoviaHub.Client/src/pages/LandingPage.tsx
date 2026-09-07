import { useState, useEffect } from "react";
import type { LoginResponse } from "../../services/authService";
import UserAvatar from "../components/UserAvatar";

const resources = [
  { label: "Drop-in skrivbord", total: 15, booked: 9, icon: "⬜", color: "#3b82f6" },
  { label: "Mötesrum", total: 4, booked: 2, icon: "▪", color: "#00d4aa" },
  { label: "VR-headset", total: 4, booked: 1, icon: "◈", color: "#a855f7" },
  { label: "AI-server", total: 1, booked: 1, icon: "◆", color: "#f59e0b" },
];

const stats = [
  { value: "147", label: "Aktiva medlemmar", delta: "+12 denna månad" },
  { value: "94%", label: "Beläggning idag", delta: "↑ från 81% igår" },
  { value: "12 ms", label: "API-svarstid", delta: "Realtid" },
  { value: "23°C", label: "Snitttemperatur", delta: "Alla rum OK" },
];

export const timeline = [
  { time: "08:00", event: "Mötesrum A – Sarah Chen (Nexify)", type: "booking" },
  { time: "09:30", event: "AI-server – beräkningsjobb startat", type: "sensor" },
  { time: "10:00", event: "VR-headset #2 bokad – Marcus Lindberg", type: "booking" },
  { time: "11:15", event: "Luftkvalitet: rum B normaliserad", type: "alert" },
  { time: "13:00", event: "Mötesrum C – Pitch session, 6 pers.", type: "booking" },
  { time: "14:30", event: "Elförbrukning: AI-server 87% kapacitet", type: "sensor" },
];

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

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 3000);
    return () => clearInterval(id);
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
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(0,212,170,0.08) 0%, transparent 70%)",
          }}
        />

        <div className="relative max-w-3xl">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-xs font-medium animate-fade-up"
            style={{
              background: "rgba(0,212,170,0.1)",
              border: "1px solid rgba(0,212,170,0.25)",
              color: "#00d4aa",
              fontFamily: "Outfit, sans-serif",
            }}
          >
            <LiveDot />
            Realtidsstatus aktiv — {resources.reduce((a, r) => a + r.booked, 0)} resurser bokade just nu
          </div>
        </div>
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
              <div className="text-xs" style={{ color: "#7a94aa" }}>{s.delta}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Resource status */}
      <section className="px-6 pb-12 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ fontFamily: "Outfit, sans-serif", color: "#e2eaf2" }}>
            Resursstatus — live
          </h2>
          <div className="flex items-center gap-2">
            <LiveDot />
            <span className="text-xs mono" style={{ color: "#7a94aa" }}>Uppdateras var 5e sekund</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {resources.map((r, i) => {
            const pct = Math.round((r.booked / r.total) * 100);
            const free = r.total - r.booked;
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
                        width: `${(tick % 2 === 0 ? pct : pct + (Math.random() * 2 - 1))}%`,
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

      {/* Activity feed + CTA side by side */}
        <section className="px-6 pb-20 max-w-6xl mx-auto">
        {/* Activity feed */}
        <div
            className="w-full rounded-xl p-5"
            style={{ background: "#0d1824", border: "1px solid #1e3347" }}
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold" style={{ fontFamily: "Outfit, sans-serif", color: "#e2eaf2" }}>Aktivitetslogg idag</h3>
            <LiveDot />
          </div>
          <div className="space-y-3">
            {timeline.map((t, i) => (
              <div key={i} className="flex items-start gap-3">
                <span
                  className="mono text-xs shrink-0 mt-0.5"
                  style={{ color: "#7a94aa", width: 40 }}
                >
                  {t.time}
                </span>
                <div
                  className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                  style={{
                    background:
                      t.type === "booking" ? "#00d4aa" :
                      t.type === "alert" ? "#f59e0b" : "#3b82f6",
                  }}
                />
                <span className="text-sm" style={{ color: t.type === "alert" ? "#f59e0b" : "#c4d4e0" }}>
                  {t.event}
                </span>
              </div>
            ))}
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
            © 2025 Innovia Hub
          </span>
          <div className="flex gap-6">
            {["Integritetspolicy", "Villkor", "Kontakt"].map((l) => (
              <a key={l} href="#" className="text-sm" style={{ color: "#7a94aa" }}>
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
