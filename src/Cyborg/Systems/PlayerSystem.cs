using System;
using System.Linq;
using Cyborg.Components;
using Cyborg.Core;
using Cyborg.Entities;
using Cyborg.Input;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Input;

namespace Cyborg.Systems
{
    public class PlayerSystem : IUpdateSystem
    {
        private const float _playerForce = 8000f;

        private readonly IEntityManager _entityManager;
        private readonly IGameInput _gameInput;

        public PlayerSystem(IEntityManager entityManager, IGameInput gameInput)
        {
            _entityManager = entityManager;
            _gameInput = gameInput;
        }

        public void Update(GameTime gameTime)
        {
            var entity = _entityManager.Get<IPlayer>().SingleOrDefault();
            if (entity == null)
                return;

            // Apply force
            if (_gameInput.Direction != Vector2.Zero)
            {
                entity.Force = _gameInput.Direction * _playerForce;
                entity.AnimatedSprite.Play(GetAnimation(_gameInput.Direction));
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