using System;
using System.Linq;
using Cyborg.Components;
using Cyborg.Core;
using Cyborg.Entities;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Input;

namespace Cyborg.Systems
{
    public class PlayerSystem : IUpdateSystem
    {
        private const float _playerForce = 8000f;

        private readonly IEntityManager _entityManager;

        public PlayerSystem(IEntityManager entityManager)
        {
            _entityManager = entityManager;
        }

        public void Update(GameTime gameTime)
        {
            var entities = _entityManager.Get<IPlayer>();
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
                    entity.AnimatedSprite.Play(GetAnimation(direction));
                }
                else
                {
                    entity.Force = Vector2.Zero;
                }
            }
        }

        private static string GetAnimation(Vector2 direction)
        {
            if (direction.X > 0)
            {
                if (direction.Y > 0)
                    return Player.AnimationWalkDownRight;
                else if (direction.Y < 0)
                    return Player.AnimationWalkUpRight;
                else
                    return Player.AnimationWalkRight;
            }
            else if (direction.X < 0)
            {
                if (direction.Y > 0)
                    return Player.AnimationWalkDownLeft;
                else if (direction.Y < 0)
                    return Player.AnimationWalkUpLeft;
                else
                    return Player.AnimationWalkLeft;
            }
            else
            {
                if (direction.Y > 0)
                    return Player.AnimationWalkDown;
                else if (direction.Y < 0)
                    return Player.AnimationWalkUp;
            }

            throw new ArgumentOutOfRangeException(nameof(direction));
        }
    }
}