using System.Collections.Generic;
using System.Linq;
using Cyborg.Components;
using Cyborg.Core;
using Microsoft.Xna.Framework;

namespace Cyborg.Systems
{
    public class DamageSystem : IUpdateSystem
    {
        private readonly IEntityManager _entityManager;
        private readonly GameState _gameState;

        public DamageSystem(IEntityManager entityManager, GameState gameState)
        {
            _entityManager = entityManager;
            _gameState = gameState;
        }

        public void Update(GameTime gameTime)
        {
            if (!_gameState.Active)
                return;

            var elapsed = (float)gameTime.ElapsedGameTime.TotalSeconds;

            foreach (var entity in _entityManager.Entities<IDamageable>())
                entity.Damage.Elapsed += elapsed;
        }
    }
}