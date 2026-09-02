export type UserApiModel = {
    id: string,
    email: string;
    firstName: string;
    lastName: string;
    isAdmin: boolean;
};

export type UserSummary = {
    id: string;
    firstname: string;
    lastname: string; 
    isAdmin: boolean;
}

const API_URL = "http://localhost:5193/api/Users";

export async function getAllUsers(): Promise<UserSummary[]> {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Kunde inte hämta användare");
    }

    const users: UserApiModel[] = await response.json();

    return users.map((user) => ({
        id: user.id,
        firstname: user.firstName,
        lastname: user.lastName,
        isAdmin: user.isAdmin
    }));
}