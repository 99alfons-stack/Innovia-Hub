import {useEffect, useState} from "react";
import type {LoginResponse} from "../../services/authService";
import {
  createBooking,
  getAllBookings,
  type Booking,
} from "../../services/bookingApiService";
import {
  getAllResources,
  getAllResourceTypes,
  type Resource as ApiResource,
  type ResourceType,
} from "../../services/resourceService";
import UserAvatar from "../components/UserAvatar";
import BookingNotification from "../components/Booking/BookingNotification.tsx";
import {
  connection,
  startNotificationConnection,
} from "../../services/notificationService";
import {
  bookingOverlapsSelection,
  generateTimeSlots, isPastTime,
  getBookingEndTime
} from "../utils/bookingUtils";
import BookingStepIndicator from "../components/Booking/BookingStepIndicator.tsx";
import ResourceTypeSelection from "../components/Booking/ResourceTypeSelection.tsx";
import BookingConfiguration from "../components/Booking/BookingConfiguration.tsx";
import BookingOverview from "../components/Booking/BookingOverview.tsx";
import type { Resource, Step } from "../types/bookingTypes.ts";
import BookingConfirmation from "../components/Booking/BookingConfirmation.tsx";

const timeSlots = generateTimeSlots(8 * 60, 17 * 60, 15);
const durations = ["1 timme", "2 timmar", "3 timmar", "Heldag"];

function mapApiResource(resource: ApiResource): Resource {
  return {
    id: resource.id,
    type: resource.resourceType,
    label: resource.name,
    sub: `${resource.capacity} ${resource.capacity === 1 ? "plats" : "platser"}`,
    status: "available",
    features: [],
    color: "#3b82f6",
    icon: "⬜",
  };
}

export default function BookingPage({user}: { user: LoginResponse | null }) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [resourceTypes, setResourceTypes] = useState<ResourceType[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  const [selected, setSelected] = useState<Resource | null>(null);
  const [step, setStep] = useState<Step>("select");
  const [timeSlot, setTimeSlot] = useState("");
  const [duration, setDuration] = useState("1 timmar");
  const [purpose, setPurpose] = useState("");
  const [date, setDate] = useState(new Date().toLocaleDateString("se-SE"));
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [latestBooking, setLatestBooking] = useState<Booking | null>(null);

  const filtered = resources
    .filter((r) => r.type.id === selectedTypeId)
    .sort((a, b) =>
      a.label.localeCompare(b.label, "sv-SE", {numeric: true})
    );

  function handleSelectResourceType(resourceTypeId: string) {
    setSelectedTypeId(resourceTypeId);
    setSelected(null);
    setStep("configure");
  }

  async function confirmBooking() {
    if (!selected) return;

    const startTime = new Date(`${date}T${timeSlot}:00`);
    const endTime = getBookingEndTime(startTime, duration);

    setIsBooking(true);
    setBookingError(null);

    try {
      const booking = await createBooking({
        resourceId: selected.id,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      });

      setCreatedBooking(booking);
      setBookings((currentBookings) => [...currentBookings, booking]);
      setStep("confirmation");
    } catch (error) {
      setBookingError(error instanceof Error ? error.message : "Bokningen kunde inte skapas");
    } finally {
      setIsBooking(false);
    }
  }

  function reset() {
    setSelected(null);
    setStep("select");
    setPurpose("");
    setBookingError(null);
  }

  useEffect(() => {
    async function loadResources() {
      try {
        const [apiResources, bookings, resourceTypes] = await Promise.all([
          getAllResources(),
          getAllBookings(),
          getAllResourceTypes(),
        ]);
        setBookings(bookings);
        setResourceTypes(resourceTypes);

        setResources(
          apiResources
            .filter((resource) => resource.isActive)
            .map((resource) => ({
              ...mapApiResource(resource),
              status: "available",
            })),
        );
      } catch (error) {
        setBookingError(error instanceof Error ? error.message : "Kunde inte hämta resurser");
      }
    }

    loadResources();
  }, []);

  useEffect(() => {
    setResources((currentResources) =>
      currentResources.map((resource) => ({
        ...resource,
        status: bookings.some((booking) =>
          bookingOverlapsSelection(booking, resource.id, date, timeSlot, duration),
        )
          ? "booked"
          : "available",
      })),
    );
  }, [bookings, date, timeSlot, duration]);

  useEffect(() => {
    let isMounted = true;

    async function connectToNotifications() {
      try {
        connection.on("BookingCreated", (booking) => {
          // SignalR-eventet innehåller den bokade resursens databasID.
          const resourceId = booking.resource?.id;

          if (!resourceId) return;

          setLatestBooking(booking);

          setBookings((currentBookings) =>
            currentBookings.some((currentBooking) => currentBooking.id === booking.id)
              ? currentBookings
              : [...currentBookings, booking],
          );
        });

        await startNotificationConnection();

        if (!isMounted) return;
      } catch (error) {
        console.error("Kunde inte ansluta till SignalR:", error);
      }
    }

    connectToNotifications();

    return () => {
      isMounted = false;
      connection.off("BookingCreated");
    };
  }, []);

  useEffect(() => {
    if (!latestBooking) return;

    const timeoutId = window.setTimeout(() => setLatestBooking(null), 5000);

    return () => window.clearTimeout(timeoutId);
  }, [latestBooking]);

  useEffect(() => {
    const firstAvailableTime = timeSlots.find((time) => !isPastTime(date, time));

    if (firstAvailableTime)
      setTimeSlot(firstAvailableTime);
  }, []);

  return (
    <div className="min-h-screen" style={{background: "#080e14"}}>
      {latestBooking && (
        <BookingNotification
          booking={latestBooking}
          onClose={() => setLatestBooking(null)}
        />
      )}
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
            style={{width: 36, height: 36, background: "linear-gradient(135deg, #00d4aa, #0070f3)"}}
          >
            <span style={{fontSize: 18}}>◈</span>
          </div>
          <span className="text-xl font-bold" style={{fontFamily: "Outfit, sans-serif", color: "#e2eaf2"}}>
            Innovia<span style={{color: "#00d4aa"}}>Hub</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <UserAvatar user={user}/>
          <span className="text-sm" style={{color: "#7a94aa"}}>
            Inloggad som <span style={{color: "#e2eaf2"}}>{user?.firstName} {user?.lastName}</span>
          </span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 pt-8 pb-32">
        <BookingStepIndicator step={step} />

        {step === "select" && (
          <ResourceTypeSelection
            resourceTypes={resourceTypes}
            onSelectResourceType={handleSelectResourceType}
          />
        )}

        {step === "configure" && (
          <BookingConfiguration
            date={date}
            duration={duration}
            timeSlot={timeSlot}
            timeSlots={timeSlots}
            durations={durations}
            resources={filtered}
            selected={selected}
            purpose={purpose}
            isPastTime={isPastTime}
            onDateChange={(newDate) => {
              setDate(newDate);
              setSelected(null);
            }}
            onDurationChange={(newDuration) => {
              setDuration(newDuration);
              setSelected(null);
            }}
            onTimeSlotChange={(newTimeSlot) => {
              setTimeSlot(newTimeSlot);
              setSelected(null);
            }}
            onSelectResource={setSelected}
            onPurposeChange={setPurpose}
            onBack={() => setStep("select")}
            onContinue={() => setStep("overview")}
          />
        )}

        {step === "overview" && selected && (
          <BookingOverview
            selected={selected}
            date={date}
            timeSlot={timeSlot}
            duration={duration}
            purpose={purpose}
            user={user}
            bookingError={bookingError}
            isBooking={isBooking}
            onBack={() => setStep("configure")}
            onCancel={reset}
            onConfirm={confirmBooking}
          />
        )}

        {step === "confirmation" && selected && createdBooking && (
          <BookingConfirmation
            selected={selected}
            createdBooking={createdBooking}
            date={date}
            timeSlot={timeSlot}
            duration={duration}
            user={user}
            onBookAnother={() => {
              setStep("select");
              setSelected(null);
              setDate("");
              setDuration("");
              setTimeSlot("");
              setPurpose("");
            }}
          />
        )}
      </div>
    </div>
  );
}
