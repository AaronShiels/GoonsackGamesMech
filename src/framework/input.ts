import { cloneDeep } from "lodash";
import { hasValue, normalise, subtract, Vector } from "../shapes";
import game from "./Game";

interface GameInput {
	moveDirection: Vector;
	attack: boolean;
	dash: boolean;
}

const tapThreshold = 0.2 * 1000;

const isTouch: boolean = "ontouchstart" in window || !!navigator.maxTouchPoints || !!navigator.msMaxTouchPoints;

enum Keys {
	S = "s",
	A = "a",
	D = "d",
	W = "w",
	Space = " "
}

interface KeyState {
	down: number;
	up: number;
}

const isDown = (current: KeyState): boolean => current.down > current.up;
const isPressed = (current: KeyState, previous: KeyState): boolean => current.down > current.up && previous.down <= previous.up;
const isHeld = (current: KeyState): boolean => current.down > current.up && performance.now() > current.down + tapThreshold;
const isTapped = (current: KeyState, previous: KeyState): boolean =>
	current.up > current.down && previous.up <= previous.down && current.up - current.down < tapThreshold;

interface KeyboardInput extends Record<Keys, KeyState> {
	w: KeyState;
	a: KeyState;
	s: KeyState;
	d: KeyState;
	" ": KeyState;
}

const currentKeyboardInput: KeyboardInput = {
	w: { down: 0, up: 0 },
	a: { down: 0, up: 0 },
	s: { down: 0, up: 0 },
	d: { down: 0, up: 0 },
	" ": { down: 0, up: 0 }
};
let previousKeyboardInput: KeyboardInput = cloneDeep(currentKeyboardInput);

interface MouseInput {
	position: Vector;
	click: KeyState;
}

const currentMouseInput: MouseInput = { position: { x: 0, y: 0 }, click: { down: 0, up: 0 } };
let previousMouseInput: MouseInput = cloneDeep(currentMouseInput);

const handleKeyDown = (event: KeyboardEvent): void => {
	if (!Object.keys(currentKeyboardInput).includes(event.key)) return;

	const key = currentKeyboardInput[event.key as Keys];
	if (!key.down || !isDown(key)) key.down = performance.now();

	event.preventDefault();
};

const handleKeyUp = (event: KeyboardEvent): void => {
	if (!Object.keys(currentKeyboardInput).includes(event.key)) return;

	const key = currentKeyboardInput[event.key as Keys];
	key.up = performance.now();

	event.preventDefault();
};

const handlePointerDown = (event: PointerEvent): void => {
	currentMouseInput.click.down = performance.now();

	event.preventDefault();
};

const handlePointerMove = (event: PointerEvent): void => {
	const position = game.stage.toLocal({ x: event.x - game.offsetX, y: event.y - game.offsetY });
	currentMouseInput.position = { x: position.x, y: position.y };

	event.preventDefault();
};

const handlePointerUp = (event: PointerEvent): void => {
	currentMouseInput.click.up = performance.now();

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
	let attack: boolean = false;
	let dash: boolean = false;

	if (isTouch) {
		attack = isTapped(currentMouseInput.click, previousMouseInput.click);

		if (isHeld(currentMouseInput.click) || attack) {
			const relativeMousePosition = subtract(currentMouseInput.position, reference);
			if (hasValue(relativeMousePosition)) moveDirection = normalise(relativeMousePosition);
		}
	} else {
		const keyboardInputVector = { x: 0, y: 0 };
		if (isDown(currentKeyboardInput.d)) keyboardInputVector.x++;
		if (isDown(currentKeyboardInput.a)) keyboardInputVector.x--;
		if (isDown(currentKeyboardInput.s)) keyboardInputVector.y++;
		if (isDown(currentKeyboardInput.w)) keyboardInputVector.y--;
		if (hasValue(keyboardInputVector)) moveDirection = normalise(keyboardInputVector);

		attack = isPressed(currentMouseInput.click, previousMouseInput.click);
		dash = isPressed(currentKeyboardInput[Keys.Space], previousKeyboardInput[Keys.Space]);
	}

	previousKeyboardInput = cloneDeep(currentKeyboardInput);
	previousMouseInput = cloneDeep(currentMouseInput);

	return { moveDirection, attack, dash };
};

export { getInput };
