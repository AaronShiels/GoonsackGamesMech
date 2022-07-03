import { DeepstreamClient } from "@deepstream/client";
import { Entity } from "./entities/entity.js";

interface GameState {
	readonly connection: DeepstreamClient;
	readonly entities: Entity[];
}

export { GameState };
