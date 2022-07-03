import { PlayerEntity } from "../../common/entities/player.js";
import { Initialiser } from "../../common/systems/system.js";
import { createPlayer } from "../entities/player.js";

const worldInit: Initialiser = (state) => {
	const testPlayer: PlayerEntity = createPlayer();
	state.entities.push(testPlayer);
};

export { worldInit };
