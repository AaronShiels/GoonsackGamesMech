import { v4 } from "uuid";

const playerIdKey = "player_id";
const gameIdKey = "game_id";

const getPlayerId = (): string => {
	const storedPlayerId = localStorage.getItem(playerIdKey);
	if (storedPlayerId) return storedPlayerId;

	const generatedPlayerId = v4();
	localStorage.setItem(playerIdKey, generatedPlayerId);

	return generatedPlayerId;
};

const getGameId = (hostGameId: string): string => {
	const urlParams = new URLSearchParams(window.location.search);
	const providedGameId = urlParams.get(gameIdKey);
	if (providedGameId) return providedGameId;

	urlParams.set(gameIdKey, hostGameId);
	return hostGameId;
};

export { getPlayerId, getGameId };
