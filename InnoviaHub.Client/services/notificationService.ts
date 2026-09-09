import {
    HubConnectionBuilder,
    HubConnectionState,
} from "@microsoft/signalr";

const connection = new HubConnectionBuilder()
    .withUrl("http://localhost:5193/hubs/notifications", {
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
