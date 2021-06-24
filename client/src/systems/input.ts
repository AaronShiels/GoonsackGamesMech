import { Initialiser, System } from ".";
import { hasValue, normalise } from "../utilities";

const inputInit: Initialiser = (game) => {
	window.addEventListener("keydown", handleKeyDown, false);
	window.addEventListener("keyup", handleKeyUp, false);
};

const inputSystem: System = (game) => {
	const keyboardMoveVector = { x: 0, y: 0 };
	if (currentKeyboardInput.d) keyboardMoveVector.x++;
	if (currentKeyboardInput.a) keyboardMoveVector.x--;
	if (currentKeyboardInput.s) keyboardMoveVector.y++;
	if (currentKeyboardInput.w) keyboardMoveVector.y--;

	const mouseButtons: number = game.renderer.plugins.interaction.mouse.buttons;

	game.input.moveDirection = hasValue(keyboardMoveVector) ? normalise(keyboardMoveVector) : keyboardMoveVector;
	game.input.cursorPosition = game.stage.toLocal(game.renderer.plugins.interaction.mouse.global);
	game.input.firing = !!(mouseButtons & 1);
};

enum Keys {
	S = "s",
	A = "a",
	D = "d",
	W = "w",
	Space = " "
}

interface KeyboardInput extends Record<Keys, boolean> {
	w: boolean;
	a: boolean;
	s: boolean;
	d: boolean;
	" ": boolean;
}

let currentKeyboardInput: KeyboardInput = {
	w: false,
	a: false,
	s: false,
	d: false,
	" ": false
};

const handleKeyDown = (event: KeyboardEvent): void => {
	if (!Object.keys(currentKeyboardInput).includes(event.key)) return;

	currentKeyboardInput[event.key as Keys] = true;
	event.preventDefault();
};

const handleKeyUp = (event: KeyboardEvent): void => {
	if (!Object.keys(currentKeyboardInput).includes(event.key)) return;

	currentKeyboardInput[event.key as Keys] = false;
	event.preventDefault();
};

export { inputInit, inputSystem };
