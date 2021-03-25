import { hasValue, normalise, subtract, Vector } from "../shapes";
import game from "./Game";

interface GameInput {
	moveDirection: Vector;
	attack: GameButton;
	dash: GameButton;
}

interface GameButton {
	pressed: boolean;
	held: boolean;
}

const isTouch: boolean = "ontouchstart" in window || !!navigator.maxTouchPoints || !!navigator.msMaxTouchPoints;

enum Keys {
	S = "s",
	A = "a",
	D = "d",
	W = "w",
	Space = " "
}

const currentKeyboardInput: Record<Keys, boolean> = {
	w: false,
	a: false,
	s: false,
	d: false,
	" ": false
};
let previousKeyboardInput = Object.assign({}, currentKeyboardInput);

const currentMouseInput = { position: { x: 0, y: 0 }, clickDown: false };
let previousMouseInput = Object.assign({}, currentMouseInput);

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

const handlePointerDown = (event: PointerEvent): void => {
	currentMouseInput.clickDown = true;

	event.preventDefault();
};

const handlePointerMove = (event: PointerEvent): void => {
	const position = game.stage.toLocal({ x: event.x - game.offsetX, y: event.y - game.offsetY });
	currentMouseInput.position = { x: position.x, y: position.y };

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
window.addEventListener("pointerleave", handlePointerUp, false);
window.addEventListener("pointermove", handlePointerMove, false);

const getInput = (reference: Vector): GameInput => {
	let moveDirection: Vector = { x: 0, y: 0 };
	let attack: GameButton = { pressed: false, held: false };
	let dash: GameButton = { pressed: false, held: false };

	if (isTouch) {
		const relativeMousePosition = subtract(currentMouseInput.position, reference);
		if (hasValue(relativeMousePosition)) moveDirection = normalise(relativeMousePosition);
	} else {
		const keyboardInputVector = { x: 0, y: 0 };
		if (currentKeyboardInput.d) keyboardInputVector.x++;
		if (currentKeyboardInput.a) keyboardInputVector.x--;
		if (currentKeyboardInput.s) keyboardInputVector.y++;
		if (currentKeyboardInput.w) keyboardInputVector.y--;
		if (hasValue(keyboardInputVector)) moveDirection = normalise(keyboardInputVector);

		attack.held = currentMouseInput.clickDown;
		attack.pressed = currentMouseInput.clickDown && !previousMouseInput.clickDown;

		dash.held = currentKeyboardInput[Keys.Space];
		dash.pressed = currentKeyboardInput[Keys.Space] && !previousKeyboardInput[Keys.Space];
	}

	Object.assign(previousKeyboardInput, currentKeyboardInput);
	Object.assign(previousMouseInput, currentMouseInput);

	return { moveDirection, attack, dash };
};

export { getInput };
