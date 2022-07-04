import { Game } from "./game.js";

const game = new Game();
document.body.appendChild(game.view);
game.load();
