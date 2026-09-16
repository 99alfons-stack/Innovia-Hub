import BookingCalendar from "./BookingCalendar";
import type { Resource } from "../../types/bookingTypes.ts";

type BookingConfigurationProps = {
  date: string;
  duration: string;
  timeSlot: string;
  timeSlots: string[];
  durations: string[];
  resources: Resource[];
  selected: Resource | null;
  purpose: string;
  isPastTime: (date: string, time: string) => boolean;
  onDateChange: (date: string) => void;
  onDurationChange: (duration: string) => void;
  onTimeSlotChange: (timeSlot: string) => void;
  onSelectResource: (resource: Resource) => void;
  onPurposeChange: (purpose: string) => void;
  onBack: () => void;
  onContinue: () => void;
};

export default function BookingConfiguration({
    date,
    duration,
    timeSlot,
    timeSlots,
    durations,
    resources,
    selected,
    purpose,
    isPastTime,
    onDateChange,
    onDurationChange,
    onTimeSlotChange,
    onSelectResource,
    onPurposeChange,
    onBack,
    onContinue,
  }: BookingConfigurationProps) {
  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 mb-6 text-sm"
        style={{color: "#7a94aa"}}
      >
        ← Tillbaka
      </button>

      <h1
        className="text-2xl font-bold mb-2"
        style={{
          fontFamily: "Outfit, sans-serif",
          color: "#e2eaf2",
        }}
      >
        Konfigurera bokning
      </h1>

      <p
        className="text-sm mb-8"
        style={{color: "#7a94aa"}}
      >
        Välj datum, starttid och längd. Välj sedan en ledig resurs.
      </p>

      <div className="grid lg:grid-cols-[360px_1fr] gap-8">

        <div
          className="space-y-6 rounded-xl p-5"
          style={{
            background: "#0d1824",
            border: "1px solid #1e3347",
          }}
        >

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{
                color: "#e2eaf2",
                fontFamily: "Outfit, sans-serif",
              }}
            >
              Datum
            </label>

            <BookingCalendar
              selectedDate={date}
              onSelectDate={onDateChange}
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{
                color: "#e2eaf2",
                fontFamily: "Outfit, sans-serif",
              }}
            >
              Längd
            </label>

            <div className="flex gap-2 flex-wrap">
              {durations.map((d) => (
                <button
                  key={d}
                  onClick={() => onDurationChange(d)}
                  className="px-4 py-2 rounded-lg text-sm transition-all duration-150"
                  style={{
                    background:
                      duration === d
                        ? "rgba(0,212,170,0.15)"
                        : "#0d1824",
                    border: `1px solid ${
                      duration === d ? "#00d4aa" : "#1e3347"
                    }`,
                    color:
                      duration === d ? "#00d4aa" : "#7a94aa",
                    fontFamily: "Outfit, sans-serif",
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{
                color: "#e2eaf2",
                fontFamily: "Outfit, sans-serif",
              }}
            >
              Starttid
            </label>

            <div className="flex flex-wrap gap-2">
              {timeSlots.map((t) => {
                const isPast = isPastTime(date, t);

                return (
                  <button
                    key={t}
                    onClick={() => {
                      if (isPast) return;
                      onTimeSlotChange(t);
                    }}
                    disabled={isPast}
                    className="px-3 py-2 rounded-lg text-sm mono transition-all duration-150"
                    style={{
                      background:
                        timeSlot === t
                          ? "rgba(0,212,170,0.15)"
                          : "#0d1824",
                      border: `1px solid ${
                        timeSlot === t ? "#00d4aa" : "#1e3347"
                      }`,
                      color: isPast
                        ? "#405060"
                        : timeSlot === t
                          ? "#00d4aa"
                          : "#7a94aa",
                      opacity: isPast ? 0.4 : 1,
                      cursor: isPast ? "not-allowed" : "pointer",
                    }}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div
          className="rounded-xl p-5 self-start"
          style={{
            background: "#0d1824",
            border: "1px solid #1e3347",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-lg font-semibold"
              style={{
                color: "#e2eaf2",
                fontFamily: "Outfit, sans-serif",
              }}
            >
              Resurser
            </h2>

            <div className="flex items-center gap-4">
              {[
                { color: "#00d4aa", label: "Ledig" },
                { color: "#f43f5e", label: "Bokad" },
                { color: "#f59e0b", label: "Reserverad" },
              ].map((l) => (
                <div
                  key={l.label}
                  className="flex items-center gap-1.5"
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: l.color }}
                  />

                  <span
                    className="text-xs"
                    style={{ color: "#7a94aa" }}
                  >
                    {l.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {resources.map((r) => {
              const avail = r.status === "available";
              const isSelected = selected?.id === r.id;

              return (
                <button
                  key={r.id}
                  onClick={() => avail && onSelectResource(r)}
                  disabled={!avail}
                  className="rounded-xl p-5 text-left transition-all duration-150"
                  style={{
                    background: "#111e2d",
                    border: `1px solid ${
                      isSelected ? "#00d4aa" : "#1e3347"
                    }`,
                    opacity: avail ? 1 : 0.5,
                    cursor: avail ? "pointer" : "not-allowed",
                    boxShadow: isSelected
                      ? "0 0 0 1px rgba(0,212,170,0.15)"
                      : "none",
                  }}
                >
                  <div
                    className="text-sm font-semibold mb-1"
                    style={{color: "#e2eaf2"}}
                  >
                    {r.label}
                  </div>

                  <div
                    className="text-xs mb-3"
                    style={{color: "#7a94aa"}}
                  >
                    {r.sub}
                  </div>

                  <span
                    className="inline-block px-2 py-0.5 rounded-full text-xs"
                    style={{
                      background: avail
                        ? "rgba(0,212,170,0.1)"
                        : "rgba(244,63,94,0.1)",
                      color: avail ? "#00d4aa" : "#f43f5e",
                    }}
                  >
                    {avail ? "Ledig" : "Bokad"}
                  </span>
                </button>
              );
            })}
          </div>

          {resources.length === 0 && (
            <div
              className="rounded-xl p-6 text-sm mt-3"
              style={{
                background: "#0d1824",
                border: "1px solid #1e3347",
                color: "#7a94aa",
              }}
            >
              Det finns inga resurser för den valda typen.
            </div>
          )}
        </div>
      </div>

      {selected && (
        <div className="max-w-2xl mt-8 mx-auto">
          <label
            className="block text-sm font-medium mb-2"
            style={{
              color: "#e2eaf2",
              fontFamily: "Outfit, sans-serif",
            }}
          >
            Syfte (valfritt)
          </label>

          <textarea
            rows={3}
            placeholder="Ex: Kundmöte med Acme AB, designworkshop..."
            value={purpose}
            onChange={(e) => onPurposeChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
            style={{
              background: "#0d1824",
              border: "1px solid #1e3347",
              color: "#e2eaf2",
            }}
          />
        </div>
      )}

      <div className="max-w-2xl mt-6 mx-auto">
        <button
          onClick={onContinue}
          disabled={!selected}
          className="w-full py-3 rounded-xl font-semibold transition-all duration-150"
          style={{
            background: "#00d4aa",
            color: "#080e14",
            fontFamily: "Outfit, sans-serif",
            opacity: selected ? 1 : 0.4,
            cursor: selected ? "pointer" : "not-allowed",
          }}
        >
          {selected
            ? `Fortsätt med ${selected.label} →`
            : "Välj en resurs för att fortsätta"}
        </button>
      </div>
    </div>
  );
}