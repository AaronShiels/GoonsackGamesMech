using System.Collections.Generic;
using System.Linq;
using Cyborg.Components;
using Cyborg.Core;
using Cyborg.Entities;
using Microsoft.Xna.Framework;

namespace Cyborg.Systems
{
    public class ParticleSystem : IUpdateSystem
    {
        private readonly IReadOnlyCollection<IEntity> _entities;
        private readonly IGameState _gameState;

        public ParticleSystem(IReadOnlyCollection<IEntity> entities, IGameState gameState)
        {
            _entities = entities;
            _gameState = gameState;
        }

        public void Update(GameTime gameTime)
        {
            if (!_gameState.Active)
                return;

            var elapsed = (float)gameTime.ElapsedGameTime.TotalSeconds;

            var particleEntities = _entities.OfType<IState<ParticleStateComponent>>();
            foreach (var entity in particleEntities)
            {
                entity.State.Elapsed += elapsed;

                if (entity.State.Expired)
                    entity.Destroyed = true;
            }
        }
    }
}