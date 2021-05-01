import { cloneDeep } from "lodash";
import { System } from ".";
import { hasValue, normalise, subtract, timestampSeconds, Vector } from "../utilities";

const inputSystem: System = (game, _) => {
	let moveDirection: Vector = { x: 0, y: 0 };

	const keyboardMoveVector = { x: 0, y: 0 };
	if (isDown(currentKeyboardInput.d)) keyboardMoveVector.x++;
	if (isDown(currentKeyboardInput.a)) keyboardMoveVector.x--;
	if (isDown(currentKeyboardInput.s)) keyboardMoveVector.y++;
	if (isDown(currentKeyboardInput.w)) keyboardMoveVector.y--;
	if (hasValue(keyboardMoveVector)) moveDirection = normalise(keyboardMoveVector);

	const cursorPosition = game.stage.toLocal(subtract(currentMouseInput.position, game.offset));

	game.input.cursorPosition = cursorPosition;
	game.input.moveDirection = moveDirection;

	previousKeyboardInput = cloneDeep(currentKeyboardInput);
	previousMouseInput = cloneDeep(currentMouseInput);
};

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

interface KeyboardInput extends Record<Keys, KeyState> {
	w: KeyState;
	a: KeyState;
	s: KeyState;
	d: KeyState;
	" ": KeyState;
}

let currentKeyboardInput: KeyboardInput = {
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

let currentMouseInput: MouseInput = { position: { x: 0, y: 0 }, click: { down: 0, up: 0 } };
let previousMouseInput: MouseInput = cloneDeep(currentMouseInput);

const isDown = (current: KeyState): boolean => current.down > current.up;
const isPressed = (current: KeyState, previous: KeyState): boolean => current.down > current.up && previous.down <= previous.up;

const handleKeyDown = (event: KeyboardEvent): void => {
	if (!Object.keys(currentKeyboardInput).includes(event.key)) return;

	const key = currentKeyboardInput[event.key as Keys];
	if (!key.down || !isDown(key)) key.down = timestampSeconds();

	event.preventDefault();
};

const handleKeyUp = (event: KeyboardEvent): void => {
	if (!Object.keys(currentKeyboardInput).includes(event.key)) return;

	const key = currentKeyboardInput[event.key as Keys];
	key.up = timestampSeconds();

	event.preventDefault();
};

const handlePointerDown = (event: PointerEvent): void => {
	currentMouseInput.click.down = timestampSeconds();

	event.preventDefault();
};

const handlePointerMove = (event: PointerEvent): void => {
	currentMouseInput.position = { x: event.x, y: event.y };

	event.preventDefault();
};

const handlePointerUp = (event: PointerEvent): void => {
	currentMouseInput.click.up = timestampSeconds();

	event.preventDefault();
};

window.addEventListener("keydown", handleKeyDown, false);
window.addEventListener("keyup", handleKeyUp, false);
window.addEventListener("pointerdown", handlePointerDown, false);
window.addEventListener("pointerup", handlePointerUp, false);
window.addEventListener("pointerleave", handlePointerUp, false);
window.addEventListener("pointermove", handlePointerMove, false);

export { inputSystem };
