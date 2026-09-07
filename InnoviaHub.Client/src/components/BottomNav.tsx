export type View = "landing" | "booking" | "admin" | "login";

type BottomNavProps = {
  currentView: View;
  onNavigate: (view: View) => void;
  onLogout: () => void;
};

export default function BottomNav({ currentView, onNavigate, onLogout }: BottomNavProps) {
  const items: { id: View; label: string }[] = [
    { id: "landing", label: "Landingssida" },
    { id: "booking", label: "Bokningssystem" },
    { id: "admin", label: "Adminpanel" },
  ];

  return (
    <nav
      className="fixed bottom-6 left-1/2 z-50 flex gap-1 rounded-full px-2 py-2"
      style={{
        transform: "translateX(-50%)",
        background: "rgba(13,24,36,0.95)",
        border: "1px solid #1e3347",
        backdropFilter: "blur(12px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      }}
    >
      {items.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => onNavigate(id)}
          className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
          style={{
            fontFamily: "Outfit, sans-serif",
            background: currentView === id ? "#00d4aa" : "transparent",
            color: currentView === id ? "#080e14" : "#7a94aa",
          }}
        >
          {label}
        </button>
      ))}
      <button
        onClick={onLogout}
        className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
        style={{
          fontFamily: "Outfit, sans-serif",
          background: "transparent",
          color: "#f43f5e",
        }}
      >
        Logga ut
      </button>
    </nav>
  );
}
