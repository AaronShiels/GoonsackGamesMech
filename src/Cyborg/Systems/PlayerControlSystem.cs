using System.Linq;
using Cyborg.Components;
using Cyborg.Core;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Input;

namespace Cyborg.Systems
{
    public class PlayerControlSystem : IUpdateSystem
    {
        private const float _acceleration = 400f;
        private const float _friction = 0.6f;
        private readonly IEntityManager _entityManager;

        public PlayerControlSystem(IEntityManager entityManager)
        {
            _entityManager = entityManager;
        }

        public void Update(GameTime gameTime)
        {
            var entities = _entityManager.Get<IPlayerControlled>();
            if (!entities.Any())
                return;

            var elapsed = (float)gameTime.ElapsedGameTime.TotalSeconds;
            var keyboardState = Keyboard.GetState();

            // Calculate direction
            var horizontalInput = keyboardState.IsKeyDown(Keys.D) ? 1 : keyboardState.IsKeyDown(Keys.A) ? -1 : 0;
            var verticalInput = keyboardState.IsKeyDown(Keys.S) ? 1 : keyboardState.IsKeyDown(Keys.W) ? -1 : 0;
            var direction = new Vector2(horizontalInput, verticalInput);
            if (direction != Vector2.Zero)
                direction.Normalize();

            foreach (var entity in entities)
            {
                // Apply acceleration
                if (direction != Vector2.Zero)
                    entity.Velocity += direction * _acceleration * elapsed;

                // Apply friction
                entity.Velocity *= _friction;

                // Apply velocity
                entity.Position += entity.Velocity;

                // Apply collision
                var horizontalCollision = entity.Position.X - entity.Size.X / 2 < 0 || entity.Position.X + entity.Size.X / 2 > 800;
                var verticalCollision = entity.Position.Y - entity.Size.Y / 2 < 0 || entity.Position.Y + entity.Size.Y / 2 > 480;

                if (horizontalCollision || verticalCollision)
                {
                    entity.Position = new Vector2(MathHelper.Clamp(entity.Position.X, entity.Size.X / 2, 800 - entity.Size.X / 2), MathHelper.Clamp(entity.Position.Y, entity.Size.Y / 2, 480 - entity.Size.Y / 2));
                    entity.Velocity = new Vector2(horizontalCollision ? 0 : entity.Velocity.X, verticalCollision ? 0 : entity.Velocity.Y);
                }
            }
        }
    }
}