using System;
using System.Collections.Generic;
using System.Linq;
using Cyborg.Components;
using Cyborg.Core;
using Cyborg.Entities;
using Microsoft.Xna.Framework;

namespace Cyborg.Systems
{
    public class PlayerSystem : IUpdateSystem
    {
        private const float _playerForce = 8000f;

        public void Update(IEnumerable<IEntity> entities, GameTime gameTime)
        {
            var entity = entities.OfType<IPlayer>().SingleOrDefault();
            if (entity == null)
                return;

            // Apply force
            if (entity.Direction != Vector2.Zero)
            {
                entity.Force = entity.Direction * _playerForce;

                // Animate
                var animation = GetAnimation(entity.Direction);
                if (animation != entity.Animation)
                {
                    entity.Animation = animation;
                    entity.AnimationElapsed = 0f;
                }
            }
            else
            {
                entity.Force = Vector2.Zero;
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