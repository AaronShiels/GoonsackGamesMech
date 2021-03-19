interface Input {
	up: boolean;
	down: boolean;
	left: boolean;
	right: boolean;
	attack: boolean;
	dash: boolean;
}

const input: Input = {
	up: false,
	down: false,
	left: false,
	right: false,
	attack: false,
	dash: false
};

const keyMapping: Record<string, keyof Input> = {
	w: "up",
	a: "left",
	s: "down",
	d: "right"
};

const handleKeyDown = (event: KeyboardEvent): void => {
	if (!Object.keys(keyMapping).includes(event.key)) return;

	input[keyMapping[event.key]] = true;
	event.preventDefault();
};

const handleKeyUp = (event: KeyboardEvent): void => {
	if (!Object.keys(keyMapping).includes(event.key)) return;

	input[keyMapping[event.key]] = false;
	event.preventDefault();
};

window.addEventListener("keydown", handleKeyDown, false);
window.addEventListener("keyup", handleKeyUp, false);

export default input;
