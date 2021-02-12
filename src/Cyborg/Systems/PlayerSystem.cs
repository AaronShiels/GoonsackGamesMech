using System.Collections.Generic;
using System.Linq;
using Cyborg.Components;
using Cyborg.Core;
using Cyborg.Entities;
using Cyborg.Utilities;
using Microsoft.Xna.Framework;

namespace Cyborg.Systems
{
    public class PlayerSystem : IUpdateSystem
    {
        private const float _playerForce = 3000f;

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

            var entity = _entities.OfType<Player>().SingleOrDefault();
            if (entity == null)
                return;

            entity.Force = _gameController.Direction != Vector2.Zero
                ? _gameController.Direction
                * _playerForce : Vector2.Zero;

            Animate(entity);
        }

        private void Animate(Player player)
        {
            if (_gameController.Direction == Vector2.Zero)
                switch (player.Animation.Current)
                {
                    case Player.AnimationWalkRight:
                        player.Animation.Update(Player.AnimationStandRight);
                        return;
                    case Player.AnimationWalkLeft:
                        player.Animation.Update(Player.AnimationStandLeft);
                        return;
                    case Player.AnimationWalkDown:
                        player.Animation.Update(Player.AnimationStandDown);
                        return;
                    case Player.AnimationWalkUp:
                        player.Animation.Update(Player.AnimationStandUp);
                        return;
                }

            var cardinalDirection = _gameController.Direction.ToCardinal();
            if (cardinalDirection == Vector2.UnitX)
                player.Animation.Update(Player.AnimationWalkRight);

            if (cardinalDirection == -Vector2.UnitX)
                player.Animation.Update(Player.AnimationWalkLeft);

            if (cardinalDirection == Vector2.UnitY)
                player.Animation.Update(Player.AnimationWalkDown);

            if (cardinalDirection == -Vector2.UnitY)
                player.Animation.Update(Player.AnimationWalkUp);
        }
    }
}