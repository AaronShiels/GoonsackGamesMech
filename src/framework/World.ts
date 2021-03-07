import { Application, Container } from "pixi.js";
import { Entity } from "../components";
import Cyborg from "../entities/Cyborg";
import { runSystems } from "../systems";
import { gameHeight, gameWidth } from "./constants";

class World extends Container {
	constructor(game: Application) {
		super();

		this.scale.x = game.screen.width / gameWidth;
		this.scale.y = game.screen.height / gameHeight;

		const cyborg = new Cyborg();
		this.addChild(cyborg);

		game.ticker.add((d) => this.update(d));
	}

	update(delta: number): void {
		runSystems(this, delta);
	}

	entities<TEntity extends Entity = Entity>(
		filter?: (entity: Entity) => entity is TEntity
	): TEntity[] {
		return this.children
			.map((e) => e as Entity)
			.filter((e) => (filter ? filter(e) : true))
			.map((e) => e as TEntity);
	}
}

export default World;
