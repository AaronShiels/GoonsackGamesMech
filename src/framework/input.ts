import { hasValue, normalise, subtract, Vector } from "../shapes";
import game from "./Game";

interface GameInput {
	moveDirection: Vector;
}

interface KeyboardInput extends Record<string, boolean> {
	w: boolean;
	a: boolean;
	s: boolean;
	d: boolean;
}

interface MouseInput {
	position: Vector;
	clickDown: boolean;
}

const currentKeyboardInput: KeyboardInput = {
	w: false,
	a: false,
	s: false,
	d: false
};

const currentMouseInput: MouseInput = { position: { x: 0, y: 0 }, clickDown: false };

const handleKeyDown = (event: KeyboardEvent): void => {
	if (!Object.keys(currentKeyboardInput).includes(event.key)) return;

	currentKeyboardInput[event.key] = true;

	event.preventDefault();
};

const handleKeyUp = (event: KeyboardEvent): void => {
	if (!Object.keys(currentKeyboardInput).includes(event.key)) return;

	currentKeyboardInput[event.key] = false;

	event.preventDefault();
};

const handlePointerDown = (event: PointerEvent): void => {
	const position = game.stage.toLocal({ x: event.x - game.offsetX, y: event.y - game.offsetY });
	currentMouseInput.position = { x: position.x, y: position.y };
	currentMouseInput.clickDown = true;

	event.preventDefault();
};

const handlePointerUp = (event: PointerEvent): void => {
	currentMouseInput.clickDown = false;

	event.preventDefault();
};

window.addEventListener("keydown", handleKeyDown, false);
window.addEventListener("keyup", handleKeyUp, false);
window.addEventListener("pointerdown", handlePointerDown, false);
window.addEventListener("pointerup", handlePointerUp, false);

const getInput = (reference: Vector): GameInput => {
	// Keyboard movement
	const keyboardInputVector: Vector = { x: 0, y: 0 };
	if (currentKeyboardInput.d) keyboardInputVector.x++;
	if (currentKeyboardInput.a) keyboardInputVector.x--;
	if (currentKeyboardInput.s) keyboardInputVector.y++;
	if (currentKeyboardInput.w) keyboardInputVector.y--;

	// Touch movement
	const moveDirection = hasValue(keyboardInputVector)
		? normalise(keyboardInputVector)
		: currentMouseInput.clickDown
		? normalise(subtract(currentMouseInput.position, reference))
		: { x: 0, y: 0 };

	return {
		moveDirection
	};
};

export { getInput };
