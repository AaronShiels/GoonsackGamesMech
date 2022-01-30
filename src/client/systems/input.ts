import { cloneDeep } from "lodash";
import { Rectangle } from "../../common/utilities/rectangle.js";
import { divide, hasValue, length, normalise, subtract, Vector } from "../../common/utilities/vector.js";
import { isTouch, touchControlPaneModifier } from "../utilities/device.js";
import { Initialiser, System } from "../../common/systems/system.js";

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

	if (isTouch) {
		controlPane.x = game.camera.width * touchControlPaneModifier.x;
		controlPane.y = game.camera.height * touchControlPaneModifier.y;
		controlPane.width = game.camera.width * touchControlPaneModifier.width;
		controlPane.height = game.camera.height * touchControlPaneModifier.height;
	} else {
		window.addEventListener("keydown", handleKeyDown, false);
		window.addEventListener("keyup", handleKeyUp, false);

		game.view.style.cursor = "none";
	}
};

const inputSystem: System = (game) => {
	const timestamp = Date.now();

	// Movement
	if (isTouch) {
		if (isPressed(controlPanePointerInput) || (isMoved(controlPanePointerInput) && isDown(controlPanePointerInput))) {
			const controlPaneCentre = divide({ x: controlPane.width, y: controlPane.height }, 2);
			const controlPanePositionCentreOffset = subtract(controlPanePointerInput.position, controlPaneCentre);
			const deadzoneLength =
				Math.min(game.camera.width * touchControlPaneModifier.width, game.camera.height * touchControlPaneModifier.height) *
				controlPaneTouchDeadzoneRatio;
			game.input.moveDirection =
				hasValue(controlPanePositionCentreOffset) && length(controlPanePositionCentreOffset) > deadzoneLength
					? normalise(controlPanePositionCentreOffset)
					: { x: 0, y: 0 };
		}
	} else {
		const keyboardMoveVector = { x: 0, y: 0 };
		if (isDown(joypadInput.right)) keyboardMoveVector.x++;
		if (isDown(joypadInput.left)) keyboardMoveVector.x--;
		if (isDown(joypadInput.down)) keyboardMoveVector.y++;
		if (isDown(joypadInput.up)) keyboardMoveVector.y--;

		game.input.moveDirection = hasValue(keyboardMoveVector) ? normalise(keyboardMoveVector) : keyboardMoveVector;
	}

	// Aiming
	if (isMoved(mainPointerInput) && (!isTouch || isDown(mainPointerInput))) game.input.cursorPosition = cloneDeep(mainPointerInput.position);
	game.input.firing = isTouch ? isTapped(mainPointerInput) : isDown(mainPointerInput);

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

	if (isTouch) {
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
	} else mainPointerInput.down = timestamp;

	event.preventDefault();
};

const handlePointerUp = (event: PointerEvent): void => {
	const timestamp = Date.now();

	if (isTouch) {
		const position = toGamePosition(event);
		if (inPane(position, controlPane)) {
			controlPanePointerInput.up = timestamp;
		} else mainPointerInput.up = timestamp;
	} else mainPointerInput.up = timestamp;

	event.preventDefault();
};

const handlePointerMove = (event: PointerEvent | DragEvent): void => {
	const timestamp = Date.now();
	const position = toGamePosition(event);

	if (isTouch && inPane(position, controlPane)) {
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
			joypadInput.up.down = timestamp;
			break;
		}
		case Keys.A: {
			joypadInput.left.down = timestamp;
			break;
		}
		case Keys.S: {
			joypadInput.down.down = timestamp;
			break;
		}
		case Keys.D: {
			joypadInput.right.down = timestamp;
			break;
		}
	}
};

const handleKeyUp = (event: KeyboardEvent): void => {
	const timestamp = Date.now();

	switch (event.key) {
		case Keys.W: {
			joypadInput.up.up = timestamp;
			break;
		}
		case Keys.A: {
			joypadInput.left.up = timestamp;
			break;
		}
		case Keys.S: {
			joypadInput.down.up = timestamp;
			break;
		}
		case Keys.D: {
			joypadInput.right.up = timestamp;
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
