import { GameState } from "../state.js";

type Initialiser = (state: GameState) => void;

type System = (state: GameState, delta: number) => void;

export { System, Initialiser };
