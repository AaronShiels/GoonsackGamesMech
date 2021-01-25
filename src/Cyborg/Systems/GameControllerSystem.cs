using System.Linq;
using Cyborg.Core;
using Cyborg.Entities;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Input;

namespace Cyborg.Systems
{
    public class GameControllerSystem : IUpdateSystem
    {
        private readonly IEntityManager _entityManager;

        public GameControllerSystem(IEntityManager entityManager)
        {
            _entityManager = entityManager;
        }

        public void Update(GameTime gameTime)
        {
            var gameController = _entityManager.Get<GameController>().SingleOrDefault();
            if (gameController == null)
                return;

            var keyboardState = Keyboard.GetState();

            // Calculate direction
            var horizontalInput = keyboardState.IsKeyDown(Keys.D) ? 1 : keyboardState.IsKeyDown(Keys.A) ? -1 : 0;
            var verticalInput = keyboardState.IsKeyDown(Keys.S) ? 1 : keyboardState.IsKeyDown(Keys.W) ? -1 : 0;
            var combinedInput = new Vector2(horizontalInput, verticalInput);
            var direction = combinedInput != Vector2.Zero ? Vector2.Normalize(combinedInput) : Vector2.Zero;

            gameController.Direction = direction;
        }
    }
}