import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

const hubConnection = new HubConnectionBuilder().withUrl("/game").configureLogging(LogLevel.Information).build();

const connect = async (): Promise<void> => {
	if (hubConnection.state !== "Disconnected") return;

	try {
		console.log("Connecting...");

		hubConnection.on("pong", (from) => console.log(`Pong received from '${from}'.`));
		await hubConnection.start();

		console.log("Connection started.");
	} catch (err) {
		if (err instanceof Error) console.log(err.message);
		else console.log(err);
	}
};

const ping = async (from: string): Promise<void> => {
	await hubConnection.send("ping", from);
	console.log(`Ping sent from '${from}'.`);
};

export { connect, ping };
