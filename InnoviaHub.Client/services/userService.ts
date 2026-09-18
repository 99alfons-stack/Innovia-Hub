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

export type CreateUserRequest = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
};

const API_URL = "http://localhost:5193/api/Users";

//Hämta alla users
export async function getAllUsers(): Promise<UserSummary[]> {
    const response = await fetch(API_URL, {
        method: "GET",
        credentials: "include"
    }); 

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

//Lägg till user/medlem
export async function createUser(user: CreateUserRequest): Promise<UserSummary>{
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(user),
    });
    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || `Kunde inte skapa medlem (${response.status})`);
    }
    const createdUser: UserApiModel = await response.json();

    return {
        id: createdUser.id,
        firstname: createdUser.firstName,
        lastname: createdUser.lastName,
        isAdmin: createdUser.isAdmin,
    }
}

//Ta bort users i medlemslistan
export async function deleteUser(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Kunde inte ta bort medlem")
    }
}