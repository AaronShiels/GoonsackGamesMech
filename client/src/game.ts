import { Application, SCALE_MODES, settings } from "pixi.js";
import { BodyComponent, hasBody, isPlayer } from "./components";
import { createCyborg, Entity } from "./entities";
import { hasValue, normalise, Rectangle, subtract, Vector } from "./utilities";
import { systems } from "./systems";
import { loadResources } from "./resources";
import { rawInput, isTouch, isDown, isPressed, isHeld, isTapped, Keys } from "./input";
import { cloneDeep } from "lodash";

settings.SCALE_MODE = SCALE_MODES.NEAREST;
settings.SORTABLE_CHILDREN = true;

interface GameSettings {
	width: number;
	height: number;
}

interface GameInput {
	moveDirection: Vector;
	attack: boolean;
	dash: boolean;
}

interface GameState {
	active(): boolean;
	transitioning: boolean;
}

class Game extends Application {
	private _offset: Vector;

	constructor(element: HTMLElement, settings: GameSettings) {
		super({
			width: element.clientWidth,
			height: (element.clientWidth / settings.width) * settings.height,
			autoDensity: true,
			resolution: window.devicePixelRatio || 1
		});

		this.settings = settings;

		this.stage.scale.x = this.screen.width / settings.width;
		this.stage.scale.y = this.screen.height / settings.height;
		element.appendChild(this.view);

		const { left, top } = element.getBoundingClientRect();
		this._offset = { x: left, y: top };

		this.camera = { x: 0, y: 0, ...settings };
	}

	public readonly settings: GameSettings;
	public readonly camera: Rectangle;
	public readonly entities: Entity[] = [];
	public readonly state: GameState = {
		active() {
			return !this.transitioning;
		},
		transitioning: false
	};
	public readonly input: GameInput = { attack: false, dash: false, moveDirection: { x: 0, y: 0 } };

	async load(): Promise<void> {
		// Initialise render target
		this.renderer.backgroundColor = parseInt("39314B", 16);

		// Load resourcess
		await loadResources();

		// Initialise player
		const cyborg = createCyborg({ x: 80, y: 90 });
		this.entities.push(cyborg);

		// Start game loop
		this.ticker.add((delta): void => {
			this.updateGameInput();

			systems.forEach((system) => system(this, delta / 60));
		});

		console.log(`Game started using ${this.renderer.type === 1 ? "WebGL" : "canvas"} renderer.`);
	}

	private updateGameInput() {
		let moveDirection: Vector = { x: 0, y: 0 };
		let attack: boolean = false;
		let dash: boolean = false;

		if (isTouch) {
			attack = isTapped(rawInput.mouse.current.click, rawInput.mouse.previous.click);

			if (isHeld(rawInput.mouse.current.click) || attack) {
				const gameMousePosition = this.stage.toLocal({
					x: rawInput.mouse.current.position.x - this._offset.x,
					y: rawInput.mouse.current.position.y - this._offset.y
				});
				const playerEntity = this.entities.filter((e) => isPlayer(e) && hasBody(e))[0] as BodyComponent | undefined;
				const relativeMousePosition = subtract(gameMousePosition, playerEntity?.position || { x: 0, y: 0 });
				if (hasValue(relativeMousePosition)) moveDirection = normalise(relativeMousePosition);
			}
		} else {
			const keyboardInputVector = { x: 0, y: 0 };
			if (isDown(rawInput.keyboard.current.d)) keyboardInputVector.x++;
			if (isDown(rawInput.keyboard.current.a)) keyboardInputVector.x--;
			if (isDown(rawInput.keyboard.current.s)) keyboardInputVector.y++;
			if (isDown(rawInput.keyboard.current.w)) keyboardInputVector.y--;
			if (hasValue(keyboardInputVector)) moveDirection = normalise(keyboardInputVector);

			attack = isPressed(rawInput.mouse.current.click, rawInput.mouse.previous.click);
			dash = isPressed(rawInput.keyboard.current[Keys.Space], rawInput.keyboard.previous[Keys.Space]);
		}

		rawInput.keyboard.previous = cloneDeep(rawInput.keyboard.current);
		rawInput.mouse.previous = cloneDeep(rawInput.mouse.current);

		this.input.attack = attack;
		this.input.dash = dash;
		this.input.moveDirection = moveDirection;
	}
}

export { Game };
