using System.Collections.Generic;
using System.Linq;
using Cyborg.Core;
using Cyborg.Entities;
using Microsoft.Xna.Framework;

namespace Cyborg.Systems
{
    public class EnemySystem : IUpdateSystem
    {
        private const float _walkingForce = 200f;

        private readonly IReadOnlyCollection<IEntity> _entities;
        private readonly IGameState _gameState;

        public EnemySystem(IReadOnlyCollection<IEntity> entities, IGameState gameState)
        {
            _entities = entities;
            _gameState = gameState;
        }

        public void Update(GameTime gameTime)
        {
            if (!_gameState.Active)
                return;

            var playerEntities = _entities.OfType<Player>();
            var enemyEntities = _entities.OfType<Enemy>();
            foreach (var entity in enemyEntities)
            {
                var enemyToClosestPlayerVector = playerEntities
                    .Select(pe => pe.Body.Position - entity.Body.Position)
                    .OrderBy(v => v.Length())
                    .FirstOrDefault();

                if (enemyToClosestPlayerVector == default)
                    return;

                var direction = Vector2.Normalize(enemyToClosestPlayerVector);
                entity.Kinetic.Force = direction * _walkingForce;
            }
        }
    }
}