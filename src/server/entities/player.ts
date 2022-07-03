import { uniqueId } from "lodash-es";
import { PlayerEntity } from "../../common/entities/player.js";

const createPlayer = (): PlayerEntity => ({
	id: uniqueId("player/"),
	type: "player",
	position: { x: 0, y: 0 },
	size: { x: 10, y: 10 },
	edges: { bottom: true, left: true, right: true, top: true },
	velocity: { x: 0, y: 0 },
	acceleration: { x: 0, y: 0 },
	friction: 0,
	destroyed: false
});

export { createPlayer };
