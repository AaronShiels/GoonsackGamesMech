interface GameState {
	active(): boolean;
	transitioning: boolean;
}

const gameState: GameState = {
	active() {
		return !this.transitioning;
	},
	transitioning: false
};

export default gameState;
