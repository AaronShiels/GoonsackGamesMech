interface Entity {
	readonly id: string;
	readonly type: string;
	destroyed: boolean;
}

const isEntity = (object: any): object is Entity => "destroyed" in object;

export { Entity, isEntity };
