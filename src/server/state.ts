import { DeepstreamClient } from "@deepstream/client";
import { GameState } from "../common/state.js";

const createGameState = (connection: DeepstreamClient): GameState => {
	connection.on("error", (...args: any[]) => console.error("Connection error", ...args));

	return {
		connection,
		entities: []
	};
};

export { createGameState };
