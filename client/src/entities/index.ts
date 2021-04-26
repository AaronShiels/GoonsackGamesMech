import { createCyborg } from "./cyborg";
import { createTile } from "./tile";
import { createZombie } from "./zombie";

interface Entity {
	destroyed: boolean;
}

const isEntity = (object: any): object is Entity => "destroyed" in object;

export { Entity, isEntity, createCyborg, createTile, createZombie };
