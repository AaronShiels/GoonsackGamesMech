using Cyborg.Core;
using Cyborg.Input;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Input;

namespace Cyborg.Systems
{
    public class GameInputSystem : IUpdateSystem
    {
        private readonly GameInput _gameInput;

        public GameInputSystem(GameInput gameInput)
        {
            _gameInput = gameInput;
        }

        public void Update(GameTime gameTime)
        {
            var keyboardState = Keyboard.GetState();

            // Calculate direction
            var horizontalInput = keyboardState.IsKeyDown(Keys.D) ? 1 : keyboardState.IsKeyDown(Keys.A) ? -1 : 0;
            var verticalInput = keyboardState.IsKeyDown(Keys.S) ? 1 : keyboardState.IsKeyDown(Keys.W) ? -1 : 0;
            var combinedInput = new Vector2(horizontalInput, verticalInput);
            var direction = combinedInput != Vector2.Zero ? Vector2.Normalize(combinedInput) : Vector2.Zero;

            _gameInput.Direction = direction;
        }
    }
}