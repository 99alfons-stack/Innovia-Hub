import { adminTabs, type AdminTab } from "./adminData";

type AdminNavigationProps = {
  tab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  alertCount: number;
  mobile?: boolean;
};

export default function AdminNavigation({
  tab,
  onTabChange,
  alertCount,
  mobile = false,
}: AdminNavigationProps) {
  return (
    <nav className={mobile ? "flex gap-2 flex-wrap" : "space-y-1"}>
      {adminTabs.map((item) => (
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
