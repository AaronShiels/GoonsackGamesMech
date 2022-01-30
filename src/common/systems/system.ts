import { Game } from "../../client/game.js";

type Initialiser = (game: Game) => void;

type System = (game: Game, deltaSeconds: number) => void;

export { System, Initialiser };
