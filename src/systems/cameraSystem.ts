import { System } from ".";
import camera from "../framework/camera";

const cameraSystem: System = (_, stage) => {
	stage.x = -(camera.x * stage.scale.x);
	stage.y = -(camera.y * stage.scale.y);
};

export default cameraSystem;
