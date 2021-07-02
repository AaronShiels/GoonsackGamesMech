import { cloneDeep } from "lodash";
import { Initialiser, System } from ".";
import { Circle, hasValue, length, normalise, subtract, Vector } from "../utilities";

const isTouch: boolean = "ontouchstart" in window || !!navigator.maxTouchPoints || !!navigator.msMaxTouchPoints;
const tapThreshold = 200;
const screenOffset: Vector = { x: 0, y: 0 };
const screenScale: Vector = { x: 0, y: 0 };
const joystickZone: Circle = { x: 0, y: 0, radius: 0 };

const inputInit: Initialiser = (game) => {
	const screenRectangle = game.view.getBoundingClientRect();
	screenOffset.x = screenRectangle.x;
	screenOffset.y = screenRectangle.y;

	screenScale.x = game.stage.scale.x;
	screenScale.y = game.stage.scale.y;

	currentPointerInput.position.x = game.camera.width / 2;
	currentPointerInput.position.y = game.camera.height / 2;

	window.addEventListener("pointerdown", handlePointerDown, false);
	window.addEventListener("pointerup", handlePointerUp, false);
	window.addEventListener("pointermove", handlePointerMove, false);

	if (isTouch) {
		joystickZone.x = game.camera.width / 8;
		joystickZone.y = (game.camera.height / 8) * 7;
		joystickZone.radius = game.camera.width / 8;
	} else {
		window.addEventListener("keydown", handleKeyDown, false);
		window.addEventListener("keyup", handleKeyUp, false);

		game.view.style.cursor = "none";
	}
};

const inputSystem: System = (game) => {
	if (isTouch) {
		game.input.moveDirection = currentJoystickInput.direction;
		game.input.firing =
			currentPointerInput.up > currentPointerInput.down &&
			previousPointerInput.up <= previousPointerInput.down &&
			currentPointerInput.up - currentPointerInput.down < tapThreshold;
	} else {
		const keyboardMoveVector = { x: 0, y: 0 };
		if (currentJoypadInput.right) keyboardMoveVector.x++;
		if (currentJoypadInput.left) keyboardMoveVector.x--;
		if (currentJoypadInput.down) keyboardMoveVector.y++;
		if (currentJoypadInput.up) keyboardMoveVector.y--;

		game.input.moveDirection = hasValue(keyboardMoveVector) ? normalise(keyboardMoveVector) : keyboardMoveVector;
		game.input.firing = currentPointerInput.down > currentPointerInput.up;
	}

	game.input.cursorPosition = currentPointerInput.position;

	previousJoypadInput = cloneDeep(currentJoypadInput);
	previousJoystickInput = cloneDeep(currentJoystickInput);
	previousPointerInput = cloneDeep(currentPointerInput);
};

enum Keys {
	S = "s",
	A = "a",
	D = "d",
	W = "w"
}

interface JoypadInput {
	down: boolean;
	left: boolean;
	right: boolean;
	up: boolean;
}

interface JoystickInput {
	direction: Vector;
}

interface PointerInput {
	position: Vector;
	down: number;
	up: number;
}

let currentJoypadInput: JoypadInput = {
	down: false,
	left: false,
	right: false,
	up: false
};
let currentJoystickInput: JoystickInput = {
	direction: { x: 0, y: 0 }
};
let currentPointerInput: PointerInput = {
	position: { x: 0, y: 0 },
	down: 0,
	up: 0
};
let previousJoypadInput: JoypadInput = cloneDeep(currentJoypadInput);
let previousJoystickInput: JoystickInput = cloneDeep(currentJoystickInput);
let previousPointerInput: PointerInput = cloneDeep(currentPointerInput);

const handlePointerDown = (event: PointerEvent): void => {
	currentPointerInput.down = Date.now();

	if (isTouch) {
		const position = {
			x: (event.x - screenOffset.x) / screenScale.x,
			y: (event.y - screenOffset.y) / screenScale.y
		};
		const joystickOffset = subtract(position, joystickZone);
		const joystickOffsetDistance = length(joystickOffset);

		if (hasValue(joystickOffset) && joystickOffsetDistance < joystickZone.radius) {
			if (joystickOffsetDistance > joystickZone.radius / 2) currentJoystickInput.direction = normalise(joystickOffset);
			else currentJoystickInput.direction = { x: 0, y: 0 };
		} else currentPointerInput.position = position;
	}

	event.preventDefault();
};

const handlePointerUp = (event: PointerEvent): void => {
	currentPointerInput.up = Date.now();

	event.preventDefault();
};

const handlePointerMove = (event: PointerEvent | DragEvent): void => {
	const position = {
		x: (event.x - screenOffset.x) / screenScale.x,
		y: (event.y - screenOffset.y) / screenScale.y
	};

	if (isTouch) {
		if (currentPointerInput.down > currentPointerInput.up) {
			const joystickOffset = subtract(position, joystickZone);
			const joystickOffsetDistance = length(joystickOffset);

			if (hasValue(joystickOffset) && joystickOffsetDistance < joystickZone.radius) {
				if (joystickOffsetDistance > joystickZone.radius / 2) currentJoystickInput.direction = normalise(joystickOffset);
				else currentJoystickInput.direction = { x: 0, y: 0 };
			} else currentPointerInput.position = position;
		}
	} else currentPointerInput.position = position;

	event.preventDefault();
};

const handleKeyDown = (event: KeyboardEvent): void => {
	switch (event.key) {
		case Keys.W: {
			currentJoypadInput.up = true;
			break;
		}
		case Keys.A: {
			currentJoypadInput.left = true;
			break;
		}
		case Keys.S: {
			currentJoypadInput.down = true;
			break;
		}
		case Keys.D: {
			currentJoypadInput.right = true;
			break;
		}
	}
};

const handleKeyUp = (event: KeyboardEvent): void => {
	switch (event.key) {
		case Keys.W: {
			currentJoypadInput.up = false;
			break;
		}
		case Keys.A: {
			currentJoypadInput.left = false;
			break;
		}
		case Keys.S: {
			currentJoypadInput.down = false;
			break;
		}
		case Keys.D: {
			currentJoypadInput.right = false;
			break;
		}
	}
};

export { inputInit, inputSystem, joystickZone };
