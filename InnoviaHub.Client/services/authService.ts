export type LoginRequest = {
    email: string;
    password: string
};

export type LoginResponse ={
    userId: string;
    email: string;
    firstName:string;
    lastName:string;
    isAdmin:boolean;
};

export type CurrentUserResponse = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isAdmin: boolean;
};

type LoginApiResponse = {
    user: CurrentUserResponse;
};

const API_URL="http://localhost:5193/api/Auth/login";
const CURRENT_USER_URL="http://localhost:5193/api/Auth/current-user";
const LOGOUT_URL="http://localhost:5193/api/Auth/logout";

export async function login(credentials:LoginRequest):Promise<LoginResponse>
{
    const response = await fetch(API_URL,{
        method: "POST",
        headers: {"content-Type": "application/json",        
        },
        credentials:"include",
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        throw new Error("Inloggning misslyckades, fel e-post eller lösenord");
    }

    const responseText = await response.text();

    if (!responseText) {
        throw new Error("API:t returnerade inget login-svar");
    }

    const responseData = JSON.parse(responseText) as LoginApiResponse;

    return {
        userId: responseData.user.id,
        email: responseData.user.email,
        firstName: responseData.user.firstName,
        lastName: responseData.user.lastName,
        isAdmin: responseData.user.isAdmin,
    };
}

export async function getCurrentUser(): Promise<LoginResponse | null> {
    const response = await fetch(CURRENT_USER_URL, {
        method: "GET",
        credentials: "include",
    });

    if (response.status === 401) {
        return null;
    }

    if (!response.ok) {
        throw new Error("Kunde inte hämta den inloggade användaren");
    }

    const user = await response.json() as CurrentUserResponse;

    return {
        userId: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isAdmin: user.isAdmin,
    };
}

export async function logout(): Promise<void> {
    const response = await fetch(LOGOUT_URL, {
        method: "POST",
        credentials: "include",
    });

    if (!response.ok && response.status !== 401) {
        throw new Error("Utloggningen misslyckades");
    }
}