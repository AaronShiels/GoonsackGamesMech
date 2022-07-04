import { cloneDeep } from "lodash";
import { Rectangle } from "../utilities/rectangle.js";
import { divide, hasValue, length, normalise, subtract, Vector } from "../utilities/vector.js";
import { touchControlPaneModifier } from "../utilities/device.js";
import { Initialiser, System } from "./system.js";

const tapThreshold = 400;
const screenOffset: Vector = { x: 0, y: 0 };
const screenScale: Vector = { x: 0, y: 0 };
const mainPane: Rectangle = { x: 0, y: 0, width: 0, height: 0 };
const controlPane: Rectangle = { x: 0, y: 0, width: 0, height: 0 };
const controlPaneTouchDeadzoneRatio: number = 0.2;

let lastUpdate: number = 0;

const inputInit: Initialiser = (game) => {
	const screenRectangle = game.view.getBoundingClientRect();
	screenOffset.x = screenRectangle.x;
	screenOffset.y = screenRectangle.y;

	screenScale.x = game.stage.scale.x;
	screenScale.y = game.stage.scale.y;

	mainPane.width = game.camera.width;
	mainPane.height = game.camera.height;

	window.addEventListener("pointerdown", handlePointerDown, false);
	window.addEventListener("pointerup", handlePointerUp, false);
	window.addEventListener("pointermove", handlePointerMove, false);
	window.addEventListener("keydown", handleKeyDown, false);
	window.addEventListener("keyup", handleKeyUp, false);

	controlPane.x = game.camera.width * touchControlPaneModifier.x;
	controlPane.y = game.camera.height * touchControlPaneModifier.y;
	controlPane.width = game.camera.width * touchControlPaneModifier.width;
	controlPane.height = game.camera.height * touchControlPaneModifier.height;

	game.view.style.cursor = "none";
};

const inputSystem: System = (game) => {
	const timestamp = Date.now();

	// Movement
	if (isPressed(controlPanePointerInput) || (isMoved(controlPanePointerInput) && isDown(controlPanePointerInput))) {
		const controlPaneCentre = divide({ x: controlPane.width, y: controlPane.height }, 2);
		const controlPanePositionCentreOffset = subtract(controlPanePointerInput.position, controlPaneCentre);
		const deadzoneLength =
			Math.min(game.camera.width * touchControlPaneModifier.width, game.camera.height * touchControlPaneModifier.height) * controlPaneTouchDeadzoneRatio;
		game.input.moveDirection =
			hasValue(controlPanePositionCentreOffset) && length(controlPanePositionCentreOffset) > deadzoneLength
				? normalise(controlPanePositionCentreOffset)
				: { x: 0, y: 0 };
	} else if (
		isPressed(joypadInput.right) ||
		isUnpressed(joypadInput.right) ||
		isPressed(joypadInput.left) ||
		isUnpressed(joypadInput.left) ||
		isPressed(joypadInput.down) ||
		isUnpressed(joypadInput.down) ||
		isPressed(joypadInput.up) ||
		isUnpressed(joypadInput.up)
	) {
		const newMoveDirection = cloneDeep(game.input.moveDirection);
		if (isPressed(joypadInput.right)) newMoveDirection.x = 1;
		if (isPressed(joypadInput.left)) newMoveDirection.x = -1;
		if (isUnpressed(joypadInput.right) || isUnpressed(joypadInput.left)) newMoveDirection.x = 0;
		if (isPressed(joypadInput.down)) newMoveDirection.y = 1;
		if (isPressed(joypadInput.up)) newMoveDirection.y = -1;
		if (isUnpressed(joypadInput.down) || isUnpressed(joypadInput.up)) newMoveDirection.y = 0;

		game.input.moveDirection = hasValue(newMoveDirection) ? normalise(newMoveDirection) : { x: 0, y: 0 };
	}

	// Aiming
	if (isMoved(mainPointerInput) || isDown(mainPointerInput)) game.input.cursorPosition = cloneDeep(mainPointerInput.position);
	game.input.firing = isDown(mainPointerInput);

	lastUpdate = timestamp;
};

enum Keys {
	S = "s",
	A = "a",
	D = "d",
	W = "w"
}

interface ButtonInput {
	down: number;
	up: number;
}

interface JoypadInput {
	down: ButtonInput;
	left: ButtonInput;
	right: ButtonInput;
	up: ButtonInput;
}

interface PointerInput extends ButtonInput {
	position: Vector;
	moved: number;
}

const joypadInput: JoypadInput = {
	down: { down: 0, up: 0 },
	left: { down: 0, up: 0 },
	right: { down: 0, up: 0 },
	up: { down: 0, up: 0 }
};
const mainPointerInput: PointerInput = {
	position: { x: 0, y: 0 },
	moved: 0,
	down: 0,
	up: 0
};
const controlPanePointerInput: PointerInput = {
	position: { x: 0, y: 0 },
	moved: 0,
	down: 0,
	up: 0
};

const handlePointerDown = (event: PointerEvent): void => {
	const timestamp = Date.now();

	const position = toGamePosition(event);
	if (inPane(position, controlPane)) {
		controlPanePointerInput.down = timestamp;
		controlPanePointerInput.moved = timestamp;
		controlPanePointerInput.position = subtract(position, controlPane);
	} else {
		mainPointerInput.down = timestamp;
		mainPointerInput.moved = timestamp;
		mainPointerInput.position = position;
	}

	event.preventDefault();
};

const handlePointerUp = (event: PointerEvent): void => {
	const timestamp = Date.now();

	const position = toGamePosition(event);
	if (inPane(position, controlPane)) {
		controlPanePointerInput.up = timestamp;
	} else mainPointerInput.up = timestamp;

	event.preventDefault();
};

const handlePointerMove = (event: PointerEvent | DragEvent): void => {
	const timestamp = Date.now();
	const position = toGamePosition(event);

	if (inPane(position, controlPane)) {
		controlPanePointerInput.position = subtract(position, controlPane);
		controlPanePointerInput.moved = timestamp;
	} else {
		mainPointerInput.position = position;
		mainPointerInput.moved = timestamp;
	}

	event.preventDefault();
};

const handleKeyDown = (event: KeyboardEvent): void => {
	const timestamp = Date.now();

	switch (event.key) {
		case Keys.W: {
			if (isUp(joypadInput.up)) joypadInput.up.down = timestamp;
			break;
		}
		case Keys.A: {
			if (isUp(joypadInput.left)) joypadInput.left.down = timestamp;
			break;
		}
		case Keys.S: {
			if (isUp(joypadInput.down)) joypadInput.down.down = timestamp;
			break;
		}
		case Keys.D: {
			if (isUp(joypadInput.right)) joypadInput.right.down = timestamp;
			break;
		}
	}
};

const handleKeyUp = (event: KeyboardEvent): void => {
	const timestamp = Date.now();

	switch (event.key) {
		case Keys.W: {
			if (isDown(joypadInput.up)) joypadInput.up.up = timestamp;
			break;
		}
		case Keys.A: {
			if (isDown(joypadInput.left)) joypadInput.left.up = timestamp;
			break;
		}
		case Keys.S: {
			if (isDown(joypadInput.down)) joypadInput.down.up = timestamp;
			break;
		}
		case Keys.D: {
			if (isDown(joypadInput.right)) joypadInput.right.up = timestamp;
			break;
		}
	}
};

const toGamePosition = (screenPosition: Vector): Vector => divide(subtract(screenPosition, screenOffset), screenScale);

const inPane = (position: Vector, pane: Rectangle): boolean =>
	position.x > pane.x && position.x <= pane.x + pane.width && position.y > pane.y && position.y <= pane.y + pane.height;

const isDown = (button: ButtonInput): boolean => button.down > button.up;
const isUp = (button: ButtonInput): boolean => button.up >= button.down;
const isPressed = (button: ButtonInput): boolean => isDown(button) && button.down > lastUpdate;
const isUnpressed = (button: ButtonInput): boolean => isUp(button) && button.up > lastUpdate;
const isTapped = (button: ButtonInput): boolean => isUnpressed(button) && button.up - button.down < tapThreshold;
const isMoved = (pointer: PointerInput): boolean => pointer.moved > lastUpdate;

export { inputInit, inputSystem };
