import { Game } from "./game";

const element = document.getElementById("game") as HTMLDivElement | null;
if (!element) throw new Error("Game element not found.");

const settings = { width: 320, height: 176 };
const game = new Game(element, settings);
game.load();
