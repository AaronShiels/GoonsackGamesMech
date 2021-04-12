import { applyWaterFilter } from "./water";

interface AnimatedFilter {
	update(deltaSeconds: number): void;
}

const isAnimatedFilter = (object: any): object is AnimatedFilter => "update" in object;

export { AnimatedFilter, isAnimatedFilter, applyWaterFilter };
