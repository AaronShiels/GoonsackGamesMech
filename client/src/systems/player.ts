import { System } from ".";
import { isPlayer, hasBody, PlayerComponent, BodyComponent, hasPhysics } from "../components";
import { hasValue, multiply } from "../utilities";

const walkingForce = 200;

const playerSystem: System = (game, _) => {
	if (!game.state.active()) return;

	const playerEntity = game.entities.filter((e) => isPlayer(e) && hasBody(e))[0] as (PlayerComponent & BodyComponent) | undefined;
	if (!playerEntity) return;

	// Check state end
	if (playerEntity.walking.active && !hasValue(game.input.moveDirection)) playerEntity.walking.active = false;

	// Check state start
	if (!playerEntity.walking.active && hasValue(game.input.moveDirection)) playerEntity.walking.active = true;

	// Apply state
	if (playerEntity.walking.active) {
		playerEntity.direction = game.input.moveDirection;
		if (hasPhysics(playerEntity)) playerEntity.acceleration = multiply(playerEntity.direction, walkingForce);
	} else {
		if (hasPhysics(playerEntity)) playerEntity.acceleration = { x: 0, y: 0 };
	}
};
export { playerSystem };
