import type { Booking } from "../../services/bookingApiService.ts";

type BookingNotificationProps = {
  booking: Booking;
  onClose: () => void;
};

export default function BookingNotification({
  booking,
  onClose,
}: BookingNotificationProps) {
  return (
    <aside
      className="animate-slide-in fixed right-4 top-4 z-50 w-[min(22rem,calc(100vw-2rem))] rounded-xl p-4"
      style={{
        background: "#111e2d",
        border: "1px solid rgba(0, 212, 170, 0.45)",
        boxShadow: "0 12px 32px rgba(0, 0, 0, 0.35), 0 0 24px rgba(0, 212, 170, 0.12)",
      }}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
          style={{ background: "rgba(0, 212, 170, 0.14)", color: "#00d4aa" }}
          aria-hidden="true"
        >
          ✓
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold" style={{ color: "#e2eaf2" }}>
            Ny bokning skapad
          </p>
          <p className="mt-1 text-sm" style={{ color: "#7a94aa" }}>
            {booking.resource.name} har precis bokats.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="-mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-lg"
          style={{ color: "#7a94aa" }}
          aria-label="Stäng meddelandet"
        >
          ×
        </button>
      </div>
    </aside>
  );
}