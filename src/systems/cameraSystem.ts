import { System } from ".";
import camera from "../framework/camera";

const cameraSystem: System = (world) => {
	world.stage.x = -(camera.x * world.stage.scale.x);
	world.stage.y = -(camera.y * world.stage.scale.y);
};

export default cameraSystem;
