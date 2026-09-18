import {
    HubConnectionBuilder,
    HubConnectionState,
} from "@microsoft/signalr";
import { BASE_API_URL} from "../config/api.ts";

const connection = new HubConnectionBuilder()
    .withUrl(`${BASE_API_URL}/hubs/notifications`, {
        withCredentials: true,
    })
    .withAutomaticReconnect()
    .build();

export async function startNotificationConnection() {
    if (connection.state === HubConnectionState.Disconnected) {
        await connection.start();
    }

    return connection;
}

export { connection };
