import type {Resource} from "../../types/bookingTypes";
import type {LoginResponse} from "../../../services/authService";
import {getBookingEndTime} from "../../utils/bookingUtils";

type BookingOverviewProps = {
  selected: Resource;
  date: string;
  timeSlot: string;
  duration: string;
  purpose: string;
  user: LoginResponse | null;
  bookingError: string | null;
  isBooking: boolean;

  onBack: () => void;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function BookingOverview(
  {
    selected,
    date,
    timeSlot,
    duration,
    purpose,
    user,
    bookingError,
    isBooking,
    onBack,
    onCancel,
    onConfirm,
  }: BookingOverviewProps) {
  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 mb-6 text-sm"
        style={{color: "#7a94aa"}}
      >
        ← Tillbaka
      </button>
      <div className="max-w-lg mx-auto mt-10">
        <h1
          className="text-2xl font-bold mb-6"
          style={{
            fontFamily: "Outfit, sans-serif",
            color: "#e2eaf2",
          }}
        >
          Översikt
        </h1>

        <div
          className="rounded-xl p-6 mb-6"
          style={{
            background: "#0d1824",
            border: "1px solid #1e3347",
          }}
        >
          <div
            className="flex items-center gap-3 mb-5 pb-5"
            style={{borderBottom: "1px solid #1e3347"}}
          >
            <div
              className="rounded-xl flex items-center justify-center text-2xl"
              style={{
                width: 52,
                height: 52,
                background: selected.color + "18",
                color: selected.color,
              }}
            >
              {selected.icon}
            </div>

            <div>
              <div
                className="font-bold text-lg"
                style={{
                  fontFamily: "Outfit, sans-serif",
                  color: "#e2eaf2",
                }}
              >
                {selected.label}
              </div>

              <div
                className="text-sm"
                style={{color: "#7a94aa"}}
              >
                {selected.sub}
              </div>
            </div>
          </div>

          {[
            {
              label: "Datum",
              value: new Date(date).toLocaleDateString("sv-SE", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
            },
            {
              label: "Starttid",
              value: timeSlot,
            },
            {
              label: "Sluttid",
              value: getBookingEndTime(
                new Date(`${date}T${timeSlot}:00`),
                duration
              ).toLocaleTimeString("sv-SE", {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
            {
              label: "Längd",
              value: duration,
            },
            {
              label: "Bokad av",
              value: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim(),
            },
            ...(purpose
              ? [
                {
                  label: "Syfte",
                  value: purpose,
                },
              ]
              : []),
          ].map((row) => (
            <div
              key={row.label}
              className="flex justify-between items-start py-2.5"
              style={{borderBottom: "1px solid #1e3347"}}
            >
            <span
              className="text-sm"
              style={{color: "#7a94aa"}}
            >
              {row.label}
            </span>

              <span
                className="text-sm font-medium text-right max-w-xs"
                style={{
                  color: "#e2eaf2",
                  fontFamily:
                    row.label === "Starttid" || row.label === "Sluttid"
                      ? "JetBrains Mono, monospace"
                      : "inherit",
                }}
              >
              {row.value}
            </span>
            </div>
          ))}
        </div>

        <div
          className="rounded-xl px-4 py-3 mb-6 flex items-start gap-3"
          style={{
            background: "rgba(0,212,170,0.08)",
            border: "1px solid rgba(0,212,170,0.2)",
          }}
        >
        <span
          style={{
            color: "#00d4aa",
            fontSize: 16,
            marginTop: 1,
          }}
        >
          ℹ
        </span>

          <p
            className="text-sm"
            style={{
              color: "#7a94aa",
              lineHeight: 1.6,
            }}
          >
            Du får en bekräftelse via e-post och kan se din bokning i
            aktivitetsloggen. Avbokning är möjlig upp till 1 timme innan.
          </p>
        </div>

        {bookingError && (
          <p
            className="text-sm mb-6"
            style={{color: "#f43f5e"}}
          >
            {bookingError}
          </p>
        )}

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl font-semibold text-sm"
            style={{
              background: "#111e2d",
              border: "1px solid #1e3347",
              color: "#7a94aa",
              fontFamily: "Outfit, sans-serif",
            }}
          >
            Avbryt
          </button>

          <button
            onClick={onConfirm}
            disabled={isBooking}
            className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-150"
            style={{
              background: "#00d4aa",
              color: "#080e14",
              fontFamily: "Outfit, sans-serif",
              opacity: isBooking ? 0.6 : 1,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "#00f0c4")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "#00d4aa")
            }
          >
            {isBooking ? "Skapar bokning..." : "Bekräfta bokning ✓"}
          </button>
        </div>
      </div>
    </div>
  );
}