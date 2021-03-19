import { Container, Application } from "pixi.js";
import { BaseComponent, hasSprite } from "../components";
import { createCyborg } from "../entities/cyborg";
import systems from "../systems";

interface World {
	addEntity<TEntity extends BaseComponent>(entity: TEntity): void;
	getEntities(): BaseComponent[];
}

const createWorld = (game: Application): World => {
	const worldContainer = new Container();
	game.stage.addChild(worldContainer);

	const entities: BaseComponent[] = [];

	const addEntity = <TEntity extends BaseComponent>(entity: TEntity): void => {
		entities.push(entity);

		if (hasSprite(entity)) worldContainer.addChild(entity.sprite);
	};

	const getEntities = (): BaseComponent[] => entities;

	const world = { addEntity, getEntities };
	game.ticker.add((delta) => systems.forEach((system) => system(world, delta / 60)));

	const cyborg = createCyborg({ x: 80, y: 90 });
	world.addEntity(cyborg);

	return world;
};

export default World;
export { createWorld };
