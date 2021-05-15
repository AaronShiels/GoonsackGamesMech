import { System } from ".";
import { isEnemy } from "../components";

const enemySystem: System = (game) => {
	if (!game.state.active()) return;

	for (const entity of game.stage.children) {
		if (!isEnemy(entity)) continue;

		// TODO
	}
};

export { enemySystem };
