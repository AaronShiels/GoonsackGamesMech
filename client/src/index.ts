import { Game } from "./game";

const screenDimensions = Math.min(window.innerWidth, window.innerHeight);
const game = new Game(screenDimensions);
document.body.appendChild(game.view);
game.load();
