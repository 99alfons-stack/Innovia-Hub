import { useState } from "react";

type ResourceType = "desk" | "room" | "vr" | "ai";
type Step = "select" | "configure" | "confirm" | "done";

interface Resource {
  id: string;
  type: ResourceType;
  label: string;
  sub: string;
  status: "available" | "booked" | "reserved";
  features: string[];
  color: string;
  icon: string;
}

const allResources: Resource[] = [
  ...Array.from({ length: 15 }, (_, i) => ({
    id: `desk-${i + 1}`,
    type: "desk" as ResourceType,
    label: `Skrivbord ${i + 1}`,
    sub: i < 5 ? "Zon A – Fönster" : i < 10 ? "Zon B – Mitten" : "Zon C – Tyst",
    status: (i < 9 ? "booked" : "available") as Resource["status"],
    features: ["Skärm", "USB-C", "Ergonomisk stol"],
    color: "#3b82f6",
    icon: "⬜",
  })),
  { id: "room-a", type: "room", label: "Mötesrum A", sub: "6 pers · Projektor · Whiteboard", status: "booked", features: ["4K-projektor", "Whiteboard", "Videokonferens", "Luftkonditionering"], color: "#00d4aa", icon: "▪" },
  { id: "room-b", type: "room", label: "Mötesrum B", sub: "4 pers · TV-skärm", status: "available", features: ["65\" TV", "HDMI", "Videokonferens"], color: "#00d4aa", icon: "▪" },
  { id: "room-c", type: "room", label: "Mötesrum C", sub: "10 pers · Workshop", status: "available", features: ["Whiteboard x2", "4K-projektor", "Videokonferens", "Kök"], color: "#00d4aa", icon: "▪" },
  { id: "room-d", type: "room", label: "Mötesrum D", sub: "3 pers · Fokusrum", status: "reserved", features: ["TV 43\"", "HDMI", "Tyst zon"], color: "#00d4aa", icon: "▪" },
  { id: "vr-1", type: "vr", label: "VR-headset #1", sub: "Meta Quest 3 · Laddat 100%", status: "booked", features: ["Meta Quest 3", "Hand tracking", "PC-VR via streaming"], color: "#a855f7", icon: "◈" },
  { id: "vr-2", type: "vr", label: "VR-headset #2", sub: "Meta Quest 3 · Laddat 87%", status: "booked", features: ["Meta Quest 3", "Hand tracking"], color: "#a855f7", icon: "◈" },
  { id: "vr-3", type: "vr", label: "VR-headset #3", sub: "Meta Quest Pro · Laddat 94%", status: "available", features: ["Meta Quest Pro", "Eye tracking", "PC-VR via streaming"], color: "#a855f7", icon: "◈" },
  { id: "vr-4", type: "vr", label: "VR-headset #4", sub: "Meta Quest 3 · Laddat 62%", status: "available", features: ["Meta Quest 3", "Hand tracking"], color: "#a855f7", icon: "◈" },
  { id: "ai-1", type: "ai", label: "AI-server", sub: "NVIDIA H100 · 80GB VRAM", status: "booked", features: ["NVIDIA H100", "80GB VRAM", "100 GbE nätverk", "CUDA 12.3", "Jupyter-åtkomst"], color: "#f59e0b", icon: "◆" },
];

const typeFilters = [
  { id: "all", label: "Alla" },
  { id: "desk", label: "Skrivbord" },
  { id: "room", label: "Mötesrum" },
  { id: "vr", label: "VR-headset" },
  { id: "ai", label: "AI-server" },
];

const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
const durations = ["1 timme", "2 timmar", "3 timmar", "Heldag"];

export default function BookingPage({ onAdmin }: { onAdmin: () => void }) {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Resource | null>(null);
  const [step, setStep] = useState<Step>("select");
  const [timeSlot, setTimeSlot] = useState("10:00");
  const [duration, setDuration] = useState("2 timmar");
  const [purpose, setPurpose] = useState("");
  const [date, setDate] = useState("2025-11-18");

  const filtered = allResources.filter(
    (r) => filter === "all" || r.type === filter
  );

  function selectResource(r: Resource) {
    if (r.status !== "available") return;
    setSelected(r);
    setStep("configure");
  }

  function reset() {
    setSelected(null);
    setStep("select");
    setPurpose("");
  }

  return (
    <div className="min-h-screen" style={{ background: "#080e14" }}>
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
          <span className="text-sm" style={{ color: "#7a94aa" }}>
            Inloggad som <span style={{ color: "#e2eaf2" }}>Marcus Lindberg</span>
          </span>
          <button
            onClick={onAdmin}
            className="text-xs px-3 py-1.5 rounded-lg"
            style={{ background: "#111e2d", border: "1px solid #1e3347", color: "#7a94aa", fontFamily: "Outfit, sans-serif" }}
          >
            Admin →
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-8">
          {(["select", "configure", "confirm", "done"] as Step[]).map((s, i) => {
            const labels = ["Välj resurs", "Konfigurera", "Bekräfta", "Klart"];
            const stepIdx = ["select", "configure", "confirm", "done"].indexOf(step);
            const isActive = s === step;
            const isDone = i < stepIdx;
            return (
              <div key={s} className="flex items-center gap-2">
                <div
                  className="flex items-center gap-2"
                  style={{ opacity: isDone || isActive ? 1 : 0.4 }}
                >
                  <div
                    className="rounded-full flex items-center justify-center text-xs font-bold mono"
                    style={{
                      width: 24, height: 24,
                      background: isDone ? "#00d4aa" : isActive ? "#00d4aa" : "#1e3347",
                      color: isDone || isActive ? "#080e14" : "#7a94aa",
                    }}
                  >
                    {isDone ? "✓" : i + 1}
                  </div>
                  <span className="hidden sm:block text-sm" style={{ color: isActive ? "#e2eaf2" : "#7a94aa", fontFamily: "Outfit, sans-serif" }}>
                    {labels[i]}
                  </span>
                </div>
                {i < 3 && (
                  <div className="w-8 h-px" style={{ background: i < stepIdx ? "#00d4aa" : "#1e3347" }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Step: Select */}
        {step === "select" && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h1 className="text-2xl font-bold" style={{ fontFamily: "Outfit, sans-serif", color: "#e2eaf2" }}>
                Välj en resurs att boka
              </h1>
              <div className="flex gap-2 flex-wrap">
                {typeFilters.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150"
                    style={{
                      background: filter === f.id ? "#00d4aa" : "#111e2d",
                      color: filter === f.id ? "#080e14" : "#7a94aa",
                      border: `1px solid ${filter === f.id ? "#00d4aa" : "#1e3347"}`,
                      fontFamily: "Outfit, sans-serif",
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filtered.map((r) => {
                const avail = r.status === "available";
                return (
                  <button
                    key={r.id}
                    onClick={() => selectResource(r)}
                    disabled={!avail}
                    className="rounded-xl p-4 text-left transition-all duration-150"
                    style={{
                      background: "#0d1824",
                      border: `1px solid ${avail ? "#1e3347" : "#1e3347"}`,
                      opacity: avail ? 1 : 0.5,
                      cursor: avail ? "pointer" : "not-allowed",
                    }}
                    onMouseEnter={(e) => avail && (e.currentTarget.style.borderColor = r.color + "66")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e3347")}
                  >
                    <div
                      className="rounded-lg flex items-center justify-center text-base mb-3"
                      style={{ width: 36, height: 36, background: r.color + "18", color: r.color }}
                    >
                      {r.icon}
                    </div>
                    <div className="text-sm font-semibold mb-1" style={{ fontFamily: "Outfit, sans-serif", color: "#e2eaf2" }}>
                      {r.label}
                    </div>
                    <div className="text-xs mb-2" style={{ color: "#7a94aa" }}>{r.sub}</div>
                    <span
                      className="inline-block px-2 py-0.5 rounded-full text-xs mono"
                      style={{
                        background: avail ? "rgba(0,212,170,0.1)" : "rgba(244,63,94,0.1)",
                        color: avail ? "#00d4aa" : r.status === "reserved" ? "#f59e0b" : "#f43f5e",
                        border: `1px solid ${avail ? "rgba(0,212,170,0.2)" : "rgba(244,63,94,0.2)"}`,
                      }}
                    >
                      {avail ? "Ledig" : r.status === "reserved" ? "Reserverad" : "Bokad"}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex items-center gap-4">
              {[
                { color: "#00d4aa", label: "Ledig" },
                { color: "#f43f5e", label: "Bokad" },
                { color: "#f59e0b", label: "Reserverad" },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
                  <span className="text-xs" style={{ color: "#7a94aa" }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step: Configure */}
        {step === "configure" && selected && (
          <div className="max-w-2xl">
            <button onClick={reset} className="flex items-center gap-2 mb-6 text-sm" style={{ color: "#7a94aa" }}>
              ← Tillbaka
            </button>
            <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "Outfit, sans-serif", color: "#e2eaf2" }}>
              Konfigurera bokning
            </h1>
            <p className="text-sm mb-8" style={{ color: "#7a94aa" }}>
              Du bokar: <span style={{ color: selected.color }}>{selected.label}</span>
            </p>

            <div className="space-y-6">
              {/* Date */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#e2eaf2", fontFamily: "Outfit, sans-serif" }}>
                  Datum
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm mono outline-none"
                  style={{
                    background: "#0d1824",
                    border: "1px solid #1e3347",
                    color: "#e2eaf2",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#00d4aa")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#1e3347")}
                />
              </div>

              {/* Time slot */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#e2eaf2", fontFamily: "Outfit, sans-serif" }}>
                  Starttid
                </label>
                <div className="flex flex-wrap gap-2">
                  {timeSlots.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTimeSlot(t)}
                      className="px-3 py-2 rounded-lg text-sm mono transition-all duration-150"
                      style={{
                        background: timeSlot === t ? "rgba(0,212,170,0.15)" : "#0d1824",
                        border: `1px solid ${timeSlot === t ? "#00d4aa" : "#1e3347"}`,
                        color: timeSlot === t ? "#00d4aa" : "#7a94aa",
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#e2eaf2", fontFamily: "Outfit, sans-serif" }}>
                  Längd
                </label>
                <div className="flex gap-2 flex-wrap">
                  {durations.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDuration(d)}
                      className="px-4 py-2 rounded-lg text-sm transition-all duration-150"
                      style={{
                        background: duration === d ? "rgba(0,212,170,0.15)" : "#0d1824",
                        border: `1px solid ${duration === d ? "#00d4aa" : "#1e3347"}`,
                        color: duration === d ? "#00d4aa" : "#7a94aa",
                        fontFamily: "Outfit, sans-serif",
                      }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Purpose */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#e2eaf2", fontFamily: "Outfit, sans-serif" }}>
                  Syfte (valfritt)
                </label>
                <textarea
                  rows={3}
                  placeholder="Ex: Kundmöte med Acme AB, designworkshop..."
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                  style={{
                    background: "#0d1824",
                    border: "1px solid #1e3347",
                    color: "#e2eaf2",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#00d4aa")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#1e3347")}
                />
              </div>

              {/* Features */}
              <div
                className="rounded-xl p-4"
                style={{ background: "#111e2d", border: "1px solid #1e3347" }}
              >
                <div className="text-xs font-medium mb-3" style={{ color: "#7a94aa", fontFamily: "Outfit, sans-serif" }}>
                  Ingår i bokningen
                </div>
                <div className="flex flex-wrap gap-2">
                  {selected.features.map((f) => (
                    <span
                      key={f}
                      className="px-3 py-1 rounded-full text-xs"
                      style={{
                        background: selected.color + "15",
                        color: selected.color,
                        border: `1px solid ${selected.color}33`,
                      }}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setStep("confirm")}
                className="w-full py-3 rounded-xl font-semibold transition-all duration-150"
                style={{ background: "#00d4aa", color: "#080e14", fontFamily: "Outfit, sans-serif" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#00f0c4")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#00d4aa")}
              >
                Gå vidare till bekräftelse →
              </button>
            </div>
          </div>
        )}

        {/* Step: Confirm */}
        {step === "confirm" && selected && (
          <div className="max-w-lg">
            <button onClick={() => setStep("configure")} className="flex items-center gap-2 mb-6 text-sm" style={{ color: "#7a94aa" }}>
              ← Tillbaka
            </button>
            <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: "Outfit, sans-serif", color: "#e2eaf2" }}>
              Bekräfta bokning
            </h1>

            <div
              className="rounded-xl p-6 mb-6"
              style={{ background: "#0d1824", border: "1px solid #1e3347" }}
            >
              <div className="flex items-center gap-3 mb-5 pb-5" style={{ borderBottom: "1px solid #1e3347" }}>
                <div
                  className="rounded-xl flex items-center justify-center text-2xl"
                  style={{ width: 52, height: 52, background: selected.color + "18", color: selected.color }}
                >
                  {selected.icon}
                </div>
                <div>
                  <div className="font-bold text-lg" style={{ fontFamily: "Outfit, sans-serif", color: "#e2eaf2" }}>{selected.label}</div>
                  <div className="text-sm" style={{ color: "#7a94aa" }}>{selected.sub}</div>
                </div>
              </div>

              {[
                { label: "Datum", value: new Date(date).toLocaleDateString("sv-SE", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) },
                { label: "Starttid", value: timeSlot },
                { label: "Längd", value: duration },
                { label: "Bokad av", value: "Marcus Lindberg" },
                ...(purpose ? [{ label: "Syfte", value: purpose }] : []),
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-start py-2.5" style={{ borderBottom: "1px solid #1e3347" }}>
                  <span className="text-sm" style={{ color: "#7a94aa" }}>{row.label}</span>
                  <span className="text-sm font-medium text-right max-w-xs" style={{ color: "#e2eaf2", fontFamily: row.label === "Starttid" ? "JetBrains Mono, monospace" : "inherit" }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            <div
              className="rounded-xl px-4 py-3 mb-6 flex items-start gap-3"
              style={{ background: "rgba(0,212,170,0.08)", border: "1px solid rgba(0,212,170,0.2)" }}
            >
              <span style={{ color: "#00d4aa", fontSize: 16, marginTop: 1 }}>ℹ</span>
              <p className="text-sm" style={{ color: "#7a94aa", lineHeight: 1.6 }}>
                Du får en bekräftelse via e-post och kan se din bokning i aktivitetsloggen. Avbokning är möjlig upp till 1 timme innan.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={reset}
                className="flex-1 py-3 rounded-xl font-semibold text-sm"
                style={{ background: "#111e2d", border: "1px solid #1e3347", color: "#7a94aa", fontFamily: "Outfit, sans-serif" }}
              >
                Avbryt
              </button>
              <button
                onClick={() => setStep("done")}
                className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-150"
                style={{ background: "#00d4aa", color: "#080e14", fontFamily: "Outfit, sans-serif" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#00f0c4")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#00d4aa")}
              >
                Bekräfta bokning ✓
              </button>
            </div>
          </div>
        )}

        {/* Step: Done */}
        {step === "done" && selected && (
          <div className="max-w-md text-center mx-auto py-16">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-glow"
              style={{ background: "rgba(0,212,170,0.15)", border: "2px solid rgba(0,212,170,0.4)" }}
            >
              <span style={{ fontSize: 36, color: "#00d4aa" }}>✓</span>
            </div>
            <h1 className="text-3xl font-bold mb-3" style={{ fontFamily: "Outfit, sans-serif", color: "#e2eaf2" }}>
              Bokning bekräftad!
            </h1>
            <p className="text-sm mb-2" style={{ color: "#7a94aa" }}>
              {selected.label} · {timeSlot} · {duration}
            </p>
            <p className="mono text-xs mb-8" style={{ color: "#7a94aa" }}>
              Boknings-ID: <span style={{ color: "#00d4aa" }}>INH-{Math.floor(Math.random() * 9000 + 1000)}</span>
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={reset}
                className="px-6 py-3 rounded-xl font-semibold text-sm"
                style={{ background: "#00d4aa", color: "#080e14", fontFamily: "Outfit, sans-serif" }}
              >
                Boka en till
              </button>
              <button
                className="px-6 py-3 rounded-xl font-semibold text-sm"
                style={{ background: "#111e2d", border: "1px solid #1e3347", color: "#7a94aa", fontFamily: "Outfit, sans-serif" }}
              >
                Mina bokningar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
