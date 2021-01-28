using System.Linq;
using Cyborg.Components;
using Cyborg.Core;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Input;

namespace Cyborg.Systems
{
    public class ControllerSystem : IUpdateSystem
    {
        private readonly IEntityManager _entityManager;

        public ControllerSystem(IEntityManager entityManager)
        {
            _entityManager = entityManager;
        }

        public void Update(GameTime gameTime)
        {
            var entities = _entityManager.Get<IControllable>();

            if (!entities.Any())
                return;

            var keyboardState = Keyboard.GetState();

            // Calculate direction
            var horizontalInput = keyboardState.IsKeyDown(Keys.D) ? 1 : keyboardState.IsKeyDown(Keys.A) ? -1 : 0;
            var verticalInput = keyboardState.IsKeyDown(Keys.S) ? 1 : keyboardState.IsKeyDown(Keys.W) ? -1 : 0;
            var combinedInput = new Vector2(horizontalInput, verticalInput);
            var direction = combinedInput != Vector2.Zero ? Vector2.Normalize(combinedInput) : Vector2.Zero;

            foreach (var entity in entities)
                entity.Direction = direction;
        }
    }
}