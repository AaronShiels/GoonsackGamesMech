using System.Linq;
using Cyborg.Core;
using Microsoft.Xna.Framework;

namespace Cyborg.Systems
{
    public class DebugSystem : IUpdateSystem
    {
        private readonly GameState _gameState;
        private readonly IGameController _gameController;

        public DebugSystem(GameState gameState, IGameController gameController)
        {
            _gameState = gameState;
            _gameController = gameController;
        }

        public void Update(GameTime gameTime)
        {
            if (_gameController.Pressed.Contains(Button.Debug))
                _gameState.Debug = !_gameState.Debug;
        }
    }
}