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

const API_URL="http://localhost:5193/api/Auth/login";
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

    return JSON.parse(responseText) as LoginResponse;
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