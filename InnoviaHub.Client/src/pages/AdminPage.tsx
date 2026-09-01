import { useState } from "react";

type AdminTab = "dashboard" | "sensors" | "resources" | "members";

const sensors = [
  { id: "s1", name: "Temperatur – Mötesrum A", value: "22.4°C", status: "ok", location: "Rum A", icon: "🌡", trend: "+0.3°" },
  { id: "s2", name: "Luftkvalitet – Mötesrum B", value: "CO₂ 412 ppm", status: "ok", location: "Rum B", icon: "💨", trend: "Stabilt" },
  { id: "s3", name: "Rörelse – Coworking zon A", value: "Aktiv", status: "ok", location: "Zon A", icon: "👁", trend: "9 pers." },
  { id: "s4", name: "Elförbrukning – AI-server", value: "3.8 kWh", status: "warn", location: "Serverhall", icon: "⚡", trend: "↑ 12%" },
  { id: "s5", name: "Temperatur – AI-server", value: "71°C", status: "warn", location: "Serverhall", icon: "🌡", trend: "↑ 8°C" },
  { id: "s6", name: "Rörelse – Serverhall", value: "Inaktiv", status: "ok", location: "Serverhall", icon: "🔒", trend: "Inga larm" },
  { id: "s7", name: "Temperatur – Mötesrum C", value: "19.8°C", status: "ok", location: "Rum C", icon: "🌡", trend: "-0.5°" },
  { id: "s8", name: "Luftkvalitet – Coworking", value: "CO₂ 689 ppm", status: "alert", location: "Zon B", icon: "💨", trend: "↑ Hög" },
];

const members = [
  { id: "m1", name: "Marcus Lindberg", email: "marcus@nexify.se", role: "Startup", joined: "2024-03-12", bookings: 47, status: "active" },
  { id: "m2", name: "Sarah Chen", email: "sarah@deeproots.io", role: "Forskare", joined: "2024-01-08", bookings: 89, status: "active" },
  { id: "m3", name: "Erik Johansson", email: "erik@pivotlabs.se", role: "Startup", joined: "2024-06-22", bookings: 23, status: "active" },
  { id: "m4", name: "Amina Osei", email: "amina@uni.se", role: "Universitetspart.", joined: "2023-11-01", bookings: 134, status: "active" },
  { id: "m5", name: "Jonas Falk", email: "jonas@ionstack.io", role: "Startup", joined: "2025-01-14", bookings: 11, status: "inactive" },
  { id: "m6", name: "Lisa Bergström", email: "lisa@citylabs.se", role: "Konsult", joined: "2024-09-03", bookings: 58, status: "active" },
];

const recentBookings = [
  { resource: "Mötesrum A", user: "Sarah Chen", time: "09:00–11:00", date: "Idag", status: "active" },
  { resource: "AI-server", user: "Amina Osei", time: "08:00–16:00", date: "Idag", status: "active" },
  { resource: "VR-headset #2", user: "Marcus Lindberg", time: "10:00–11:00", date: "Idag", status: "active" },
  { resource: "Mötesrum C", user: "Erik Johansson", time: "13:00–15:00", date: "Idag", status: "upcoming" },
  { resource: "Skrivbord 3", user: "Lisa Bergström", time: "08:00–17:00", date: "Idag", status: "active" },
  { resource: "Mötesrum B", user: "Jonas Falk", time: "09:00–10:00", date: "Igår", status: "completed" },
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    ok: { bg: "rgba(0,212,170,0.1)", color: "#00d4aa", label: "OK" },
    warn: { bg: "rgba(245,158,11,0.1)", color: "#f59e0b", label: "Varning" },
    alert: { bg: "rgba(244,63,94,0.1)", color: "#f43f5e", label: "Larm" },
    active: { bg: "rgba(0,212,170,0.1)", color: "#00d4aa", label: "Aktiv" },
    inactive: { bg: "rgba(122,148,170,0.1)", color: "#7a94aa", label: "Inaktiv" },
    upcoming: { bg: "rgba(59,130,246,0.1)", color: "#3b82f6", label: "Kommande" },
    completed: { bg: "rgba(122,148,170,0.1)", color: "#7a94aa", label: "Avslutad" },
  };
  const s = map[status] || map.ok;
  return (
    <span
      className="inline-block px-2 py-0.5 rounded-full text-xs mono"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}33` }}
    >
      {s.label}
    </span>
  );
}

export default function AdminPage({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<AdminTab>("dashboard");

  const tabs: { id: AdminTab; label: string; icon: string }[] = [
    { id: "dashboard", label: "Översikt", icon: "◈" },
    { id: "sensors", label: "Sensorer", icon: "⚙" },
    { id: "resources", label: "Resurser", icon: "▪" },
    { id: "members", label: "Medlemmar", icon: "◯" },
  ];

  const alerts = sensors.filter((s) => s.status !== "ok");

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#080e14" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-6 py-4"
        style={{
          background: "rgba(8,14,20,0.95)",
          borderBottom: "1px solid #1e3347",
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-sm flex items-center gap-1" style={{ color: "#7a94aa" }}>
            ← Tillbaka
          </button>
          <div className="w-px h-4" style={{ background: "#1e3347" }} />
          <div className="flex items-center gap-2">
            <div
              className="rounded-lg flex items-center justify-center"
              style={{ width: 32, height: 32, background: "linear-gradient(135deg, #00d4aa, #0070f3)" }}
            >
              <span style={{ fontSize: 16 }}>◈</span>
            </div>
            <span className="font-bold" style={{ fontFamily: "Outfit, sans-serif", color: "#e2eaf2" }}>
              Admin
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {alerts.length > 0 && (
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{ background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.25)" }}
            >
              <div className="pulse-dot w-2 h-2 rounded-full" style={{ background: "#f43f5e" }} />
              <span className="text-xs mono" style={{ color: "#f43f5e" }}>{alerts.length} larm aktiva</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: "linear-gradient(135deg, #00d4aa33, #3b82f633)", color: "#00d4aa", border: "1px solid #1e3347" }}
            >
              JL
            </div>
            <span className="text-sm hidden md:block" style={{ color: "#e2eaf2" }}>Johanna Lambert</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className="hidden md:flex flex-col w-52 shrink-0 pt-6 px-3"
          style={{ borderRight: "1px solid #1e3347" }}
        >
          <nav className="space-y-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
                style={{
                  background: tab === t.id ? "rgba(0,212,170,0.1)" : "transparent",
                  color: tab === t.id ? "#00d4aa" : "#7a94aa",
                  border: tab === t.id ? "1px solid rgba(0,212,170,0.2)" : "1px solid transparent",
                  fontFamily: "Outfit, sans-serif",
                }}
              >
                <span style={{ fontSize: 14, width: 20 }}>{t.icon}</span>
                {t.label}
                {t.id === "sensors" && alerts.length > 0 && (
                  <span
                    className="ml-auto rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold"
                    style={{ background: "#f43f5e", color: "white" }}
                  >
                    {alerts.length}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="mt-auto pb-6 px-3">
            <div
              className="rounded-xl p-3"
              style={{ background: "#111e2d", border: "1px solid #1e3347" }}
            >
              <div className="text-xs mono mb-1" style={{ color: "#7a94aa" }}>Systemstatus</div>
              <div className="flex items-center gap-2">
                <div className="pulse-dot w-2 h-2 rounded-full" style={{ background: "#00d4aa" }} />
                <span className="text-xs" style={{ color: "#00d4aa" }}>Alla system online</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Mobile tabs */}
          <div className="flex gap-2 mb-6 md:hidden flex-wrap">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium"
                style={{
                  background: tab === t.id ? "#00d4aa" : "#111e2d",
                  color: tab === t.id ? "#080e14" : "#7a94aa",
                  border: "1px solid " + (tab === t.id ? "#00d4aa" : "#1e3347"),
                  fontFamily: "Outfit, sans-serif",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Dashboard */}
          {tab === "dashboard" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold" style={{ fontFamily: "Outfit, sans-serif", color: "#e2eaf2" }}>
                Översikt
              </h1>

              {/* KPI row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Beläggning", value: "94%", sub: "av total kapacitet", color: "#00d4aa" },
                  { label: "Aktiva bokningar", value: "23", sub: "just nu", color: "#3b82f6" },
                  { label: "Aktiva larm", value: String(alerts.length), sub: "sensorer kräver åtgärd", color: alerts.length > 0 ? "#f43f5e" : "#00d4aa" },
                  { label: "Nya idag", value: "8", sub: "bokningar skapade", color: "#a855f7" },
                ].map((k) => (
                  <div key={k.label} className="rounded-xl p-5" style={{ background: "#0d1824", border: "1px solid #1e3347" }}>
                    <div className="mono text-2xl font-medium mb-1" style={{ color: k.color }}>{k.value}</div>
                    <div className="text-sm font-semibold mb-0.5" style={{ fontFamily: "Outfit, sans-serif", color: "#e2eaf2" }}>{k.label}</div>
                    <div className="text-xs" style={{ color: "#7a94aa" }}>{k.sub}</div>
                  </div>
                ))}
              </div>

              {/* Active alerts */}
              {alerts.length > 0 && (
                <div className="rounded-xl p-5" style={{ background: "#0d1824", border: "1px solid rgba(244,63,94,0.3)" }}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="pulse-dot w-2.5 h-2.5 rounded-full" style={{ background: "#f43f5e" }} />
                    <h3 className="font-bold" style={{ fontFamily: "Outfit, sans-serif", color: "#f43f5e" }}>
                      Aktiva larm ({alerts.length})
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {alerts.map((a) => (
                      <div key={a.id} className="flex items-center justify-between py-2 px-3 rounded-lg" style={{ background: "#111e2d" }}>
                        <div className="flex items-center gap-3">
                          <span style={{ fontSize: 18 }}>{a.icon}</span>
                          <div>
                            <div className="text-sm font-medium" style={{ color: "#e2eaf2" }}>{a.name}</div>
                            <div className="text-xs mono" style={{ color: "#7a94aa" }}>{a.location} · {a.value}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="mono text-sm" style={{ color: a.status === "alert" ? "#f43f5e" : "#f59e0b" }}>{a.trend}</span>
                          <StatusBadge status={a.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent bookings */}
              <div className="rounded-xl p-5" style={{ background: "#0d1824", border: "1px solid #1e3347" }}>
                <h3 className="font-bold mb-4" style={{ fontFamily: "Outfit, sans-serif", color: "#e2eaf2" }}>Senaste bokningar</h3>
                <div className="space-y-0">
                  {recentBookings.map((b, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-3"
                      style={{ borderBottom: i < recentBookings.length - 1 ? "1px solid #1e3347" : "none" }}
                    >
                      <div>
                        <span className="text-sm font-medium" style={{ color: "#e2eaf2" }}>{b.resource}</span>
                        <span className="text-sm mx-2" style={{ color: "#1e3347" }}>·</span>
                        <span className="text-sm" style={{ color: "#7a94aa" }}>{b.user}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="mono text-xs hidden sm:block" style={{ color: "#7a94aa" }}>{b.time}</span>
                        <StatusBadge status={b.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sensors */}
          {tab === "sensors" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold" style={{ fontFamily: "Outfit, sans-serif", color: "#e2eaf2" }}>
                  Sensorövervakning
                </h1>
                <div className="flex items-center gap-2">
                  <div className="pulse-dot w-2 h-2 rounded-full" style={{ background: "#00d4aa" }} />
                  <span className="text-xs mono" style={{ color: "#7a94aa" }}>Realtid · 5s uppdatering</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {sensors.map((s) => (
                  <div
                    key={s.id}
                    className="rounded-xl p-4 transition-all duration-150"
                    style={{
                      background: "#0d1824",
                      border: `1px solid ${s.status === "alert" ? "rgba(244,63,94,0.3)" : s.status === "warn" ? "rgba(245,158,11,0.3)" : "#1e3347"}`,
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="rounded-lg flex items-center justify-center text-xl"
                          style={{
                            width: 40, height: 40,
                            background: s.status === "alert" ? "rgba(244,63,94,0.1)" : s.status === "warn" ? "rgba(245,158,11,0.1)" : "rgba(0,212,170,0.1)",
                          }}
                        >
                          {s.icon}
                        </div>
                        <div>
                          <div className="text-sm font-semibold" style={{ fontFamily: "Outfit, sans-serif", color: "#e2eaf2" }}>{s.name}</div>
                          <div className="text-xs" style={{ color: "#7a94aa" }}>{s.location}</div>
                        </div>
                      </div>
                      <StatusBadge status={s.status} />
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span
                        className="mono text-xl font-medium"
                        style={{
                          color: s.status === "alert" ? "#f43f5e" : s.status === "warn" ? "#f59e0b" : "#00d4aa",
                        }}
                      >
                        {s.value}
                      </span>
                      <span className="text-xs" style={{ color: "#7a94aa" }}>{s.trend}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resources */}
          {tab === "resources" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold" style={{ fontFamily: "Outfit, sans-serif", color: "#e2eaf2" }}>
                  Resurser
                </h1>
                <button
                  className="px-4 py-2 rounded-lg text-sm font-semibold"
                  style={{ background: "#00d4aa", color: "#080e14", fontFamily: "Outfit, sans-serif" }}
                >
                  + Ny resurs
                </button>
              </div>

              <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #1e3347" }}>
                <table className="w-full">
                  <thead>
                    <tr style={{ background: "#111e2d", borderBottom: "1px solid #1e3347" }}>
                      {["Resurs", "Typ", "Status", "Bokningar idag", "Åtgärd"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: "#7a94aa", fontFamily: "Outfit, sans-serif" }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "Drop-in skrivbord (15 st)", type: "Skrivbord", status: "active", bookings: "9/15 bokade" },
                      { name: "Mötesrum A", type: "Mötesrum", status: "active", bookings: "2 bokningar" },
                      { name: "Mötesrum B", type: "Mötesrum", status: "active", bookings: "0 bokningar" },
                      { name: "Mötesrum C", type: "Mötesrum", status: "active", bookings: "1 bokning" },
                      { name: "Mötesrum D", type: "Mötesrum", status: "active", bookings: "0 bokningar" },
                      { name: "VR-headset #1–4", type: "VR", status: "active", bookings: "2/4 bokade" },
                      { name: "AI-server (H100)", type: "AI-resurs", status: "warn", bookings: "1/1 – fullt" },
                    ].map((r, i) => (
                      <tr
                        key={i}
                        style={{ borderBottom: "1px solid #1e3347", background: i % 2 === 0 ? "transparent" : "#0a1520" }}
                      >
                        <td className="px-4 py-3 text-sm font-medium" style={{ color: "#e2eaf2" }}>{r.name}</td>
                        <td className="px-4 py-3 text-sm" style={{ color: "#7a94aa" }}>{r.type}</td>
                        <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                        <td className="px-4 py-3 text-sm mono" style={{ color: "#7a94aa" }}>{r.bookings}</td>
                        <td className="px-4 py-3">
                          <button className="text-xs px-3 py-1 rounded-lg" style={{ background: "#111e2d", color: "#7a94aa", border: "1px solid #1e3347" }}>
                            Redigera
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Members */}
          {tab === "members" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold" style={{ fontFamily: "Outfit, sans-serif", color: "#e2eaf2" }}>
                  Medlemmar
                </h1>
                <button
                  className="px-4 py-2 rounded-lg text-sm font-semibold"
                  style={{ background: "#00d4aa", color: "#080e14", fontFamily: "Outfit, sans-serif" }}
                >
                  + Ny medlem
                </button>
              </div>

              <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #1e3347" }}>
                <table className="w-full">
                  <thead>
                    <tr style={{ background: "#111e2d", borderBottom: "1px solid #1e3347" }}>
                      {["Namn", "Roll", "E-post", "Bokningar", "Anslöt", "Status"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: "#7a94aa", fontFamily: "Outfit, sans-serif" }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((m, i) => (
                      <tr
                        key={m.id}
                        style={{ borderBottom: "1px solid #1e3347", background: i % 2 === 0 ? "transparent" : "#0a1520" }}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                              style={{
                                background: `hsl(${m.name.charCodeAt(0) * 17 % 360}, 30%, 20%)`,
                                color: `hsl(${m.name.charCodeAt(0) * 17 % 360}, 70%, 65%)`,
                                border: `1px solid hsl(${m.name.charCodeAt(0) * 17 % 360}, 30%, 30%)`,
                              }}
                            >
                              {m.name.split(" ").map((n) => n[0]).join("")}
                            </div>
                            <span className="text-sm font-medium" style={{ color: "#e2eaf2" }}>{m.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm" style={{ color: "#7a94aa" }}>{m.role}</td>
                        <td className="px-4 py-3 text-sm mono" style={{ color: "#7a94aa" }}>{m.email}</td>
                        <td className="px-4 py-3 text-sm mono font-medium" style={{ color: "#00d4aa" }}>{m.bookings}</td>
                        <td className="px-4 py-3 text-sm mono" style={{ color: "#7a94aa" }}>{m.joined}</td>
                        <td className="px-4 py-3"><StatusBadge status={m.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
