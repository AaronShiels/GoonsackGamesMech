import { System } from ".";
import { isAnimatedFilter } from "../filters";

const filterSystem: System = (_, stage, deltaSeconds) => {
	for (const filter of stage.filters) {
		if (!isAnimatedFilter(filter)) continue;

		filter.update(deltaSeconds);
	}
};

export { filterSystem };
