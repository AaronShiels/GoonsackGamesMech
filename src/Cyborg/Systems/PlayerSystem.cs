using System.Collections.Generic;
using System.Linq;
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

        public PlayerSystem(IReadOnlyCollection<IEntity> entities, IGameState gameState)
        {
            _entities = entities;
            _gameState = gameState;
        }

        public void Update(GameTime gameTime)
        {
            if (!_gameState.Active)
                return;

            var entity = _entities.OfType<Player>().SingleOrDefault();
            if (entity == null)
                return;

            entity.Kinetic.Force = entity.Controller.Direction != Vector2.Zero
                ? entity.Controller.Direction * _playerForce
                : Vector2.Zero;

            Animate(entity);
        }

        private void Animate(Player player)
        {
            if (player.Controller.Direction == Vector2.Zero)
                switch (player.Animation.Current)
                {
                    case Player.AnimationWalkRight:
                        player.Animation.UpdateAnimation(Player.AnimationStandRight);
                        return;
                    case Player.AnimationWalkLeft:
                        player.Animation.UpdateAnimation(Player.AnimationStandLeft);
                        return;
                    case Player.AnimationWalkDown:
                        player.Animation.UpdateAnimation(Player.AnimationStandDown);
                        return;
                    case Player.AnimationWalkUp:
                        player.Animation.UpdateAnimation(Player.AnimationStandUp);
                        return;
                }

            var cardinalDirection = player.Controller.Direction.ToCardinal();
            if (cardinalDirection == Vector2.UnitX)
                player.Animation.UpdateAnimation(Player.AnimationWalkRight);

            if (cardinalDirection == -Vector2.UnitX)
                player.Animation.UpdateAnimation(Player.AnimationWalkLeft);

            if (cardinalDirection == Vector2.UnitY)
                player.Animation.UpdateAnimation(Player.AnimationWalkDown);

            if (cardinalDirection == -Vector2.UnitY)
                player.Animation.UpdateAnimation(Player.AnimationWalkUp);
        }
    }
}