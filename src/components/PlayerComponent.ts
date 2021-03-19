import Vector from "../framework/Vector";

interface PlayerComponent {
	direction: Vector;
	walking: boolean;
}

const isPlayer = (object: any): object is PlayerComponent => "direction" in object;
const createPlayerComponent = (): PlayerComponent => {
	return {
		direction: { x: 0, y: 0 },
		walking: false
	};
};

export default PlayerComponent;
export { isPlayer, createPlayerComponent };
