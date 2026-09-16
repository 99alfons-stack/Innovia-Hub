import Alert from "./Alert";
import type { Booking } from "../../services/bookingApiService";

type AdminDashboardProps = {
  alerts: number;
  recentBookings: Booking[];
  bookingError: string | null;
  onDeleteBooking: (id: string) => void;
  onClearBookingError: () => void;
  activeBookingCount: number;
  newBookingCount: number;
  occupancyPercentage: number;
};

export default function AdminDashboard({
  alerts,
  recentBookings,
  bookingError,
  onDeleteBooking,
  onClearBookingError,
  activeBookingCount,
  newBookingCount,
  occupancyPercentage,
}: AdminDashboardProps) {
  const kpis = [
    { label: "Beläggning", value: `${occupancyPercentage}%`, sub: "av total kapacitet", color: "#00d4aa" },
    { label: "Aktiva bokningar", value: String(activeBookingCount), sub: "just nu", color: "#3b82f6" },
    { label: "Aktiva larm", value: String(alerts), sub: "sensorer kräver åtgärd", color: alerts ? "#f43f5e" : "#00d4aa" },
    { label: "Nya idag", value: String(newBookingCount), sub: "bokningar skapade", color: "#a855f7" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" style={{ fontFamily: "Outfit, sans-serif", color: "#e2eaf2" }}>
        Översikt
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-xl p-5" style={{ background: "#0d1824", border: "1px solid #1e3347" }}>
            <div className="mono text-2xl mb-1" style={{ color: kpi.color }}>{kpi.value}</div>
            <div className="text-sm font-semibold" style={{ color: "#e2eaf2" }}>{kpi.label}</div>
            <div className="text-xs" style={{ color: "#7a94aa" }}>{kpi.sub}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl p-5" style={{ background: "#0d1824", border: "1px solid #1e3347" }}>
        <h3 className="font-bold mb-4" style={{ color: "#e2eaf2" }}>Aktiva bokningar</h3>
        {bookingError && <Alert message={bookingError} type="error" onClose={onClearBookingError} />}
        {recentBookings.map((booking) => (
          <div key={booking.id} className="flex items-center justify-between gap-4 py-3" style={{ borderBottom: "1px solid #1e3347" }}>
            <div>
              <span className="text-sm font-medium" style={{ color: "#e2eaf2" }}>{booking.resource.name}</span>
              <span className="text-sm mx-2" style={{ color: "#1e3347" }}>·</span>
              <span className="text-sm" style={{ color: "#7a94aa" }}>{booking.user.firstName} {booking.user.lastName}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="mono text-xs" style={{ color: "#7a94aa" }}>
                Tid: {new Date(booking.startTime).toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" })}–{new Date(booking.endTime).toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" })}
              </span>
              <span className="mono text-xs" style={{ color: "#7a94aa" }}>Datum: {new Date(booking.startTime).toLocaleDateString("sv-SE")}</span>
              <button
                onClick={() => onDeleteBooking(booking.id)}
                className="text-xs px-3 py-2 rounded-lg"
                style={{ background: "rgba(244,63,94,0.1)", color: "#f43f5e", border: "1px solid rgba(244,63,94,0.25)", cursor: "pointer" }}
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
