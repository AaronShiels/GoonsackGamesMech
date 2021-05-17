import { Mech, MechBody, MechFoot } from "./mech";
import { Tile } from "./tile";

interface Entity {
	destroyed: boolean;
}

const isEntity = (object: any): object is Entity => "destroyed" in object;

export { Entity, isEntity, Mech, MechBody, MechFoot, Tile };
