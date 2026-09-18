import { BASE_API_URL } from "../config/api.ts";

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
    mustChangePassword: boolean;
};

export type CurrentUserResponse = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isAdmin: boolean;
    mustChangePassword: boolean;
};

type LoginApiResponse = {
    user: CurrentUserResponse;
};

const LOGIN_URL=`${BASE_API_URL}/api/Auth/login`;
const CURRENT_USER_URL=`${BASE_API_URL}/api/Auth/current-user`;
const LOGOUT_URL=`${BASE_API_URL}/api/Auth/logout`;
const CHANGE_PASSWORD_URL=`${BASE_API_URL}/api/Auth/change-password`;

export async function login(credentials:LoginRequest):Promise<LoginResponse>
{
    const response = await fetch(LOGIN_URL,{
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
        mustChangePassword: responseData.user.mustChangePassword,
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
        mustChangePassword: user.mustChangePassword,
    };
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const response = await fetch(CHANGE_PASSWORD_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (!response.ok) {
        throw new Error("Lösenordet kunde inte ändras. Kontrollera det nuvarande lösenordet och kraven för det nya.");
    }
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