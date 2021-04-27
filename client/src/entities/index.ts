import { createMech } from "./mech";
import { createTile } from "./Tile";

interface Entity {
	destroyed: boolean;
}

const isEntity = (object: any): object is Entity => "destroyed" in object;

export { Entity, isEntity, createMech, createTile };
