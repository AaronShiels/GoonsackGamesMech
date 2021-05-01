import { boundAngle, hasValue, subtract, timestampSeconds, toDegrees } from "../utilities";
import { System } from ".";
import { isPlayer, PlayerComponent, hasPhysics, PhysicsComponent, hasSprite, SpriteComponent, AnimatedSpriteCollection } from "../components";
import { multiply } from "../utilities";

const walkingForce = 200;
const turnSpeed = 3;

const playerSystem: System = (game, deltaSeconds) => {
	if (!game.state.active()) return;

	const playerEntity = game.entities.filter((e) => isPlayer(e) && hasPhysics(e) && hasSprite(e))[0] as
		| (PlayerComponent & PhysicsComponent & SpriteComponent)
		| undefined;
	if (!playerEntity) return;

	// Apply state
	playerEntity.acceleration = multiply(game.input.moveDirection, walkingForce);

	const targetVector = subtract(game.input.cursorPosition, playerEntity.position);
	if (!hasValue(targetVector)) return;

	const targetAngle = Math.atan2(targetVector.y, targetVector.x);
	const differenceAngle = boundAngle(targetAngle - playerEntity.direction);
	const deltaAngle = differenceAngle > 0 ? Math.min(differenceAngle, turnSpeed * deltaSeconds) : Math.max(differenceAngle, -turnSpeed * deltaSeconds);
	playerEntity.direction = boundAngle(playerEntity.direction + deltaAngle);

	// Apply sprite transforms
	if (!(playerEntity.sprite instanceof AnimatedSpriteCollection)) throw new Error();

	const degreeAngle = boundAngle(toDegrees(playerEntity.direction), 0, 360);
	const roundedDegreeAngle = Math.round(degreeAngle / 15) * 15;

	playerEntity.sprite.play(`mech_${roundedDegreeAngle % 90}`);
	playerEntity.sprite.angle = Math.floor(roundedDegreeAngle / 90) * 90;
};
export { playerSystem };
