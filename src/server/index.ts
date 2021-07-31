import { DeepstreamClient } from "@deepstream/client";

const username = "server";

const gameLoop = (): void => {
	console.log("Connection started.");
};

const { SERVER_HOST } = process.env;
const connection = new DeepstreamClient(SERVER_HOST || "");

connection.login({ username }).then(gameLoop);
connection.on("error", (...args: any[]) => console.error("Connection error", ...args));
