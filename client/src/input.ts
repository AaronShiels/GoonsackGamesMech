import { cloneDeep } from "lodash";
import { timestampSeconds, Vector } from "./utilities";

const tapThreshold = 0.2;

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
const isHeld = (current: KeyState): boolean => current.down > current.up && timestampSeconds() > current.down + tapThreshold;
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
const previousKeyboardInput: KeyboardInput = cloneDeep(currentKeyboardInput);

interface MouseInput {
	position: Vector;
	click: KeyState;
}

const currentMouseInput: MouseInput = { position: { x: 0, y: 0 }, click: { down: 0, up: 0 } };
const previousMouseInput: MouseInput = cloneDeep(currentMouseInput);

interface RawInput {
	keyboard: { current: KeyboardInput; previous: KeyboardInput };
	mouse: { current: MouseInput; previous: MouseInput };
}

const rawInput: RawInput = {
	keyboard: { current: currentKeyboardInput, previous: previousKeyboardInput },
	mouse: { current: currentMouseInput, previous: previousMouseInput }
};

const handleKeyDown = (event: KeyboardEvent): void => {
	if (!Object.keys(rawInput.keyboard.current).includes(event.key)) return;

	const key = rawInput.keyboard.current[event.key as Keys];
	if (!key.down || !isDown(key)) key.down = timestampSeconds();

	event.preventDefault();
};

const handleKeyUp = (event: KeyboardEvent): void => {
	if (!Object.keys(rawInput.keyboard.current).includes(event.key)) return;

	const key = rawInput.keyboard.current[event.key as Keys];
	key.up = timestampSeconds();

	event.preventDefault();
};

const handlePointerDown = (event: PointerEvent): void => {
	rawInput.mouse.current.click.down = timestampSeconds();

	event.preventDefault();
};

const handlePointerMove = (event: PointerEvent): void => {
	rawInput.mouse.current.position = { x: event.x, y: event.y };

	event.preventDefault();
};

const handlePointerUp = (event: PointerEvent): void => {
	rawInput.mouse.current.click.up = timestampSeconds();

	event.preventDefault();
};

window.addEventListener("keydown", handleKeyDown, false);
window.addEventListener("keyup", handleKeyUp, false);
window.addEventListener("pointerdown", handlePointerDown, false);
window.addEventListener("pointerup", handlePointerUp, false);
window.addEventListener("pointerleave", handlePointerUp, false);
window.addEventListener("pointermove", handlePointerMove, false);

export { Keys, rawInput, isTouch, isDown, isPressed, isHeld, isTapped };
