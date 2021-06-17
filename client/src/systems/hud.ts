import { System } from ".";
import { Mech, Reticle } from "../entities";
import { add, subtract, boundAngle } from "../utilities";

const maximumInaccuracyAngle = Math.PI / 8;
const maximumExpansion = 30;

const hudSystem: System = (game) => {
	const reticle = game.entities.filter((e) => e instanceof Reticle)[0] as Reticle;
	reticle.position.set(game.input.cursorPosition.x, game.input.cursorPosition.y);

	if (!game.state.active()) return;

	const mech = game.entities.filter((e) => e instanceof Mech)[0] as Mech | undefined;
	if (!mech) return;

	const leftArmPosition = add(mech.leftArm.position, mech.position);
	const leftArmReticleDirectionVector = subtract(reticle.position, leftArmPosition);
	const leftArmReticleAngle = Math.atan2(leftArmReticleDirectionVector.y, leftArmReticleDirectionVector.x);
	const leftArmAngleDifference = Math.abs(boundAngle(leftArmReticleAngle - mech.leftArm.direction));

	const rightArmPosition = add(mech.rightArm.position, mech.position);
	const rightArmReticleDirectionVector = subtract(reticle.position, rightArmPosition);
	const rightArmReticleAngle = Math.atan2(rightArmReticleDirectionVector.y, rightArmReticleDirectionVector.x);
	const rightArmAngleDifference = Math.abs(boundAngle(rightArmReticleAngle - mech.rightArm.direction));

	const inaccuracyRatio = Math.min(leftArmAngleDifference + rightArmAngleDifference, maximumInaccuracyAngle) / maximumInaccuracyAngle;
	const expansion = inaccuracyRatio * maximumExpansion;
	reticle.expansion = expansion;
};

export { hudSystem };
