import type { Booking } from "../services/bookingApiService";

export function generateTimeSlots(
    start: number,
    end: number,
    intervalMinutes: number,
): string[] {
    const slots: string[] = [];

    for (let i = start; i <= end; i += intervalMinutes) {
        const hours = Math.floor(i / 60);
        const minutes = i % 60;

        slots.push(
            `${hours.toString().padStart(2, "0")}:${minutes
                .toString()
                .padStart(2, "0")}`
        );
    }

    return slots;
}

export function isPastTime(date: string, time: string) {
    const selectedDateTime = new Date(`${date}T${time}:00`);
    return selectedDateTime < new Date();
}

export function bookingOverlapsSelection(
    booking: Booking,
    resourceId: string,
    date: string,
    timeSlot: string,
    duration: string,
) {
    if (booking.resource.id !== resourceId || booking.isCancelled) {
        return false;
    }

    const startTime = new Date(`${date}T${timeSlot}:00`);

    const durationHours =
        duration === "Heldag"
            ? 8
            : Number.parseInt(duration, 10);

    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + durationHours);

    return (
        new Date(booking.startTime) < endTime &&
        new Date(booking.endTime) > startTime
    );
}

export function getBookingEndTime(
    startTime: Date,
    duration: string,
) {
    const endTime = new Date(startTime);

    if (duration === "Heldag") {
        endTime.setHours(18, 0, 0, 0);
    } else {
        endTime.setHours(
            endTime.getHours() + Number.parseInt(duration, 10)
        );
    }

    return endTime;
}

