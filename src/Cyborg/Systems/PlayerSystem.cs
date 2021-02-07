using System.Collections.Generic;
using System.Linq;
using Cyborg.Components;
using Cyborg.Core;
using Cyborg.Entities;
using Cyborg.Extensions;
using Microsoft.Xna.Framework;

namespace Cyborg.Systems
{
    public class PlayerSystem : IUpdateSystem
    {
        private const float _playerForce = 4000f;

        private readonly IReadOnlyCollection<IEntity> _entities;
        private readonly IGameState _gameState;
        private readonly IGameController _gameController;

        public PlayerSystem(IReadOnlyCollection<IEntity> entities, IGameState gameState, IGameController gameController)
        {
            _entities = entities;
            _gameState = gameState;
            _gameController = gameController;
        }

        public void Update(GameTime gameTime)
        {
            if (!_gameState.Active)
                return;

            var entity = _entities.OfType<IPlayer>().SingleOrDefault();
            if (entity == null)
                return;

            entity.Force = _gameController.Direction != Vector2.Zero
                ? _gameController.Direction
                * _playerForce : Vector2.Zero;

            Animate(entity);
        }

        private void Animate(IPlayer playerEntity)
        {
            if (_gameController.Direction == Vector2.Zero)
                switch (playerEntity.Animation)
                {
                    case Player.AnimationWalkRight:
                        playerEntity.Animation = Player.AnimationStandRight;
                        playerEntity.AnimationElapsed = 0f;
                        return;
                    case Player.AnimationWalkLeft:
                        playerEntity.Animation = Player.AnimationStandLeft;
                        playerEntity.AnimationElapsed = 0f;
                        return;
                    case Player.AnimationWalkDown:
                        playerEntity.Animation = Player.AnimationStandDown;
                        playerEntity.AnimationElapsed = 0f;
                        return;
                    case Player.AnimationWalkUp:
                        playerEntity.Animation = Player.AnimationStandUp;
                        playerEntity.AnimationElapsed = 0f;
                        return;
                }

            var cardinalDirection = _gameController.Direction.ToCardinal();
            if (cardinalDirection == Vector2.UnitX && playerEntity.Animation != Player.AnimationWalkRight)
            {
                playerEntity.Animation = Player.AnimationWalkRight;
                playerEntity.AnimationElapsed = 0f;
                return;
            }

            if (cardinalDirection == -Vector2.UnitX && playerEntity.Animation != Player.AnimationWalkLeft)
            {
                playerEntity.Animation = Player.AnimationWalkLeft;
                playerEntity.AnimationElapsed = 0f;
                return;
            }

            if (cardinalDirection == Vector2.UnitY && playerEntity.Animation != Player.AnimationWalkDown)
            {
                playerEntity.Animation = Player.AnimationWalkDown;
                playerEntity.AnimationElapsed = 0f;
                return;
            }

            if (cardinalDirection == -Vector2.UnitY && playerEntity.Animation != Player.AnimationWalkUp)
            {
                playerEntity.Animation = Player.AnimationWalkUp;
                playerEntity.AnimationElapsed = 0f;
                return;
            }
        }
    }
}