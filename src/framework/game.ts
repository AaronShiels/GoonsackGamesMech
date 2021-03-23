import { Application, SCALE_MODES, settings } from "pixi.js";
import { BaseComponent } from "../components";
import { createCyborg } from "../entities";
import systems from "../systems";
import camera from "./camera";
import { loadResources } from "./resources";

settings.SCALE_MODE = SCALE_MODES.NEAREST;
settings.SORTABLE_CHILDREN = true;

class Game extends Application {
	constructor(element: HTMLElement) {
		super({
			autoDensity: true,
			height: (element.clientWidth / 16) * 9,
			width: element.clientWidth,
			resolution: window.devicePixelRatio || 1
		});

		this.renderer.backgroundColor = parseInt("39314B", 16);
		this.stage.scale.x = this.screen.width / camera.width;
		this.stage.scale.y = this.screen.height / camera.height;

		element.appendChild(this.view);
	}

	private _entities: BaseComponent[] = [];

	async load(): Promise<void> {
		await loadResources();

		const cyborg = createCyborg({ x: 80, y: 90 });
		this._entities.push(cyborg);

		this.ticker.add((delta): void => this.gameLoop(delta / 60));
	}

	private gameLoop(deltaSeconds: number): void {
		for (const system of systems) system(this._entities, this.stage, deltaSeconds);

		// Garbage collect destroyed entities
		for (let i = this._entities.length - 1; i >= 0; i--) {
			if (!this._entities[i].destroyed) continue;
			this._entities.splice(i, 1);
		}
	}
}

const gameElement = document.getElementById("game") as HTMLDivElement | null;
if (!gameElement) throw new Error("Game element not found.");

const game: Game = new Game(gameElement);

export default game;
