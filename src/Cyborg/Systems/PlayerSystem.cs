using System;
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

        private readonly IEntityManager _entityManager;

        public PlayerSystem(IEntityManager entityManager)
        {
            _entityManager = entityManager;
        }

        public void Update(GameTime gameTime)
        {
            var player = _entityManager.Get<IPlayer>().SingleOrDefault();
            var gameController = _entityManager.Get<IGameController>().SingleOrDefault();
            if (player == null || player == null)
                return;

            // Apply force
            if (gameController.Direction != Vector2.Zero)
            {
                player.Force = gameController.Direction * _playerForce;
                player.AnimatedSprite.Play(GetAnimation(gameController.Direction));
            }
            else
            {
                player.Force = Vector2.Zero;
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