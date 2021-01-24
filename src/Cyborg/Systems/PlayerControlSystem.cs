using System;
using System.Linq;
using Cyborg.Components;
using Cyborg.Core;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Input;

namespace Cyborg.Systems
{
    public class PlayerControlSystem : IUpdateSystem
    {
        private const float _playerForce = 8000f;

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

            var keyboardState = Keyboard.GetState();

            // Calculate direction
            var horizontalInput = keyboardState.IsKeyDown(Keys.D) ? 1 : keyboardState.IsKeyDown(Keys.A) ? -1 : 0;
            var verticalInput = keyboardState.IsKeyDown(Keys.S) ? 1 : keyboardState.IsKeyDown(Keys.W) ? -1 : 0;
            var combinedInput = new Vector2(horizontalInput, verticalInput);
            var direction = combinedInput != Vector2.Zero ? Vector2.Normalize(combinedInput) : Vector2.Zero;

            foreach (var entity in entities)
            {
                // Apply force
                if (direction != Vector2.Zero)
                {
                    entity.Force = direction * _playerForce;
                    entity.CurrentAnimation = GetAnimation(direction);
                }
                else
                {
                    entity.Force = Vector2.Zero;
                }

                // Play animation
                if (entity.CurrentAnimation != null)
                    entity.AnimatedSprite.Play(entity.CurrentAnimation);
            }

        }

        private static string GetAnimation(Vector2 direction)
        {
            if (direction.X > 0)
            {
                if (direction.Y > 0)
                    return "walk_down_right";
                else if (direction.Y < 0)
                    return "walk_up_right";
                else
                    return "walk_right";
            }
            else if (direction.X < 0)
            {
                if (direction.Y > 0)
                    return "walk_down_left";
                else if (direction.Y < 0)
                    return "walk_up_left";
                else
                    return "walk_left";
            }
            else
            {
                if (direction.Y > 0)
                    return "walk_down";
                else if (direction.Y < 0)
                    return "walk_up";
            }

            throw new ArgumentOutOfRangeException(nameof(direction));
        }
    }
}