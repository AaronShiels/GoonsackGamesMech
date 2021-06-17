import { BuildingSegment, createBuilding } from "./building";
import { Mech, MechBody, MechArm, MechFoot } from "./mech";
import { ExplosionTiny } from "./explosion";
import { Tile } from "./tile";
import { Reticle } from "./reticle";

interface Entity {
	destroyed: boolean;
}

const isEntity = (object: any): object is Entity => "destroyed" in object;

export { Entity, isEntity, Mech, MechBody, MechArm, MechFoot, Tile, BuildingSegment, createBuilding, ExplosionTiny, Reticle };
