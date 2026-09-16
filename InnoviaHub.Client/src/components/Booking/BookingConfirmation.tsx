import type {Resource} from "../../types/bookingTypes";
import type {LoginResponse} from "../../../services/authService";
import type {Booking} from "../../../services/bookingApiService";
import {getBookingEndTime} from "../../utils/bookingUtils";

type BookingConfirmationProps = {
  selected: Resource;
  createdBooking: Booking | null;
  date: string;
  timeSlot: string;
  duration: string;
  user: LoginResponse | null;

  onBookAnother: () => void;
};

export default function BookingConfirmation({
    selected,
    createdBooking,
    date,
    timeSlot,
    duration,
    user,
    onBookAnother,
  }: BookingConfirmationProps) {
  return (
    <div className="max-w-xl mx-auto py-12 p-3">

      {/* Success icon */}
      <div className="text-center mb-8">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 animate-glow"
          style={{
            background: "rgba(0,212,170,0.12)",
            border: "2px solid rgba(0,212,170,0.35)",
          }}
        >
          <span style={{fontSize: 36, color: "#00d4aa"}}>✓</span>
        </div>

        <h1
          className="text-3xl font-bold mb-2"
          style={{
            fontFamily: "Outfit, sans-serif",
            color: "#e2eaf2",
          }}
        >
          Bokning bekräftad!
        </h1>

        <p
          className="text-sm"
          style={{color: "#7a94aa"}}
        >
          Din bokning har skapats och är nu reserverad.
        </p>
      </div>

      <div
        className="rounded-2xl p-6 mb-6"
        style={{
          background: "#0d1824",
          border: "1px solid #1e3347",
        }}
      >
        <div
          className="flex items-center justify-between pb-5 mb-5"
          style={{borderBottom: "1px solid #1e3347"}}
        >
          <div>
            <p
              className="text-xs mb-1"
              style={{color: "#7a94aa"}}
            >
              Resurs
            </p>

            <h2
              className="text-lg font-semibold"
              style={{
                color: "#e2eaf2",
                fontFamily: "Outfit, sans-serif",
              }}
            >
              {selected.label}
            </h2>

            <p
              className="text-sm mt-1"
              style={{color: "#7a94aa"}}
            >
              {selected.sub}
            </p>
          </div>

          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              background: "rgba(0,212,170,0.10)",
              color: "#00d4aa",
              fontSize: 22,
            }}
          >
            {selected.icon}
          </div>
        </div>

        {createdBooking?.id && (
          <div className="mb-6">
            <p
              className="text-xs mb-2"
              style={{color: "#7a94aa"}}
            >
              Boknings-ID
            </p>

            <div
              className="mono text-sm px-3 py-2 rounded-lg"
              style={{
                background: "#111e2d",
                border: "1px solid #1e3347",
                color: "#00d4aa",
              }}
            >
              {createdBooking.id}
            </div>
          </div>
        )}

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
            label: "Tid",
            value: `${timeSlot} - ${getBookingEndTime(
              new Date(`${date}T${timeSlot}:00`),
              duration
            ).toLocaleTimeString("sv-SE", {
              hour: "2-digit",
              minute: "2-digit",
            })}`,
          },
          {
            label: "Längd",
            value: duration,
          },
          {
            label: "Bokad av",
            value: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim(),
          },
        ].map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between py-3"
            style={{borderBottom: "1px solid #1e3347"}}
          >
            <span
              className="text-sm"
              style={{color: "#7a94aa"}}
            >
              {row.label}
            </span>

            <span
              className="text-sm font-medium text-right"
              style={{
                color: "#e2eaf2",
                fontFamily:
                  row.label === "Tid"
                    ? "JetBrains Mono, monospace"
                    : "inherit",
              }}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBookAnother}
          className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all"
          style={{
            background: "#00d4aa",
            color: "#080e14",
            fontFamily: "Outfit, sans-serif",
          }}
        >
          + Boka en till
        </button>

        <button
          className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all"
          style={{
            background: "#111e2d",
            border: "1px solid #1e3347",
            color: "#e2eaf2",
            fontFamily: "Outfit, sans-serif",
          }}
        >
          Mina bokningar
        </button>
      </div>
    </div>
  );
}