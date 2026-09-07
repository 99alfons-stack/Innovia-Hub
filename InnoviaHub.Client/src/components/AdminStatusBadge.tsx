export default function AdminStatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    ok: { bg: "rgba(0,212,170,0.1)", color: "#00d4aa", label: "OK" },
    warn: { bg: "rgba(245,158,11,0.1)", color: "#f59e0b", label: "Varning" },
    alert: { bg: "rgba(244,63,94,0.1)", color: "#f43f5e", label: "Larm" },
    active: { bg: "rgba(0,212,170,0.1)", color: "#00d4aa", label: "Aktiv" },
    inactive: {
      bg: "rgba(122,148,170,0.1)",
      color: "#7a94aa",
      label: "Inaktiv",
    },
    upcoming: {
      bg: "rgba(59,130,246,0.1)",
      color: "#3b82f6",
      label: "Kommande",
    },
    completed: {
      bg: "rgba(122,148,170,0.1)",
      color: "#7a94aa",
      label: "Avslutad",
    },
  };
  const badge = map[status] || map.ok;

  return (
    <span
      className="inline-block px-2 py-0.5 rounded-full text-xs mono"
      style={{
        background: badge.bg,
        color: badge.color,
        border: `1px solid ${badge.color}33`,
      }}
    >
      {badge.label}
    </span>
  );
}
