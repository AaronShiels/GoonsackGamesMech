using System.Collections.Generic;
using System.Linq;
using Cyborg.Components;
using Cyborg.Core;
using Microsoft.Xna.Framework;

namespace Cyborg.Systems
{
    public class DamageSystem : IUpdateSystem
    {
        private readonly IReadOnlyCollection<IEntity> _entities;
        private readonly GameState _gameState;

        public DamageSystem(IReadOnlyCollection<IEntity> entities, GameState gameState)
        {
            _entities = entities;
            _gameState = gameState;
        }

        public void Update(GameTime gameTime)
        {
            if (!_gameState.Active)
                return;

            var elapsed = (float)gameTime.ElapsedGameTime.TotalSeconds;

            var damageableEntities = _entities.OfType<IDamageable>();
            foreach (var entity in damageableEntities)
            {
                entity.Damage.Elapsed += elapsed;
                if (entity.Damage.Remaining <= 0 && entity.Damage.Vulnerable)
                    entity.Destroyed = true;
            }
        }
    }
}