import { Application, Container } from "pixi.js";
import { BaseComponent, hasSprite } from "../components";
import { createCyborg } from "../entities";
import { Vector } from "../shapes";
import systems from "../systems";

interface World {
	camera: Vector;
	addEntities<TEntity extends BaseComponent>(entity: TEntity | TEntity[]): void;
	readonly entities: ReadonlyArray<BaseComponent>;
	readonly stage: Container;
}

const createWorld = (app: Application): World => {
	const stage: Container = app.stage;
	const entities: BaseComponent[] = [];
	const camera: Vector = { x: 180, y: 88 };

	const addEntities = <TEntity extends BaseComponent>(newEntities: TEntity | TEntity[]): void => {
		if (!Array.isArray(newEntities)) newEntities = [newEntities];

		for (const entity of newEntities) {
			entities.push(entity);
			if (hasSprite(entity)) stage.addChild(entity.sprite);
		}
	};

	const world: World = { camera, addEntities, entities, stage };
	const cyborg = createCyborg({ x: 80, y: 90 });
	world.addEntities(cyborg);

	const gameLoop = (deltaSeconds: number): void => {
		// Run all systems
		systems.forEach((system) => system(world, deltaSeconds));

		// Garbage collect destroyed
		for (let i = entities.length - 1; i >= 0; i--) {
			if (!entities[i].destroyed) continue;

			const entity = entities[i];
			if (hasSprite(entity)) stage.removeChild(entity.sprite);
			entities.splice(i, 1);
		}
	};
	app.ticker.add((delta): void => gameLoop(delta / 60));

	return world;
};

export default World;
export { createWorld };
