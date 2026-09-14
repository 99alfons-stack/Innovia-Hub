export type CreateBookingRequest = {
    resourceId: string;
    startTime: string;
    endTime: string;
};

export type Booking = {
    id: string;
    resource: {
        id: string;
        name: string;
    };
    startTime: string;
    endTime: string;
    isCancelled: boolean;
};

const API_URL = "http://localhost:5193/api/Bookings";

export async function createBooking(
    booking: CreateBookingRequest,
): Promise<Booking> {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(booking),
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || `Kunde inte skapa bokning (${response.status})`);
    }

    return response.json() as Promise<Booking>;
}

export async function getAllBookings(): Promise<Booking[]> {
    const response = await fetch(API_URL, {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Kunde inte hämta bokningar");
    }

    return response.json() as Promise<Booking[]>;
}