export type CreateBookingRequest = {
    resourceId: string;
    startTime: string;
    endTime: string;
};

export type Booking = {
    id: string;
    user: {
        id: string,
        firstName: string,
        lastName: string,
    }
    resource: {
        id: string;
        name: string;
    };
    startTime: string;
    endTime: string;
    isCancelled: boolean;
    createdAt: string,
};

const API_URL = "http://localhost:5193/api/Bookings";

async function getApiError(response: Response, fallback: string): Promise<string> {
    try {
        const body = (await response.json()) as { title?: string; message?: string };
        return body.title || body.message || fallback;
    } catch {
        return fallback;
    }
}

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
        throw new Error(
            await getApiError(response, `Kunde inte hämta bokningar (${response.status})`),
        );
    }

    return response.json() as Promise<Booking[]>;
}

export async function deleteBooking(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(
            await getApiError(
                response,
                `Kunde inte ta bort bokningen (${response.status})`,
            ),
        );
    }
}