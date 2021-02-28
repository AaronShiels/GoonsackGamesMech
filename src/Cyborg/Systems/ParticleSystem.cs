using Cyborg.Components;
using Cyborg.Core;
using Microsoft.Xna.Framework;

namespace Cyborg.Systems
{
    public class ParticleSystem : IUpdateSystem
    {
        private readonly IEntityManager _entityManager;
        private readonly IGameState _gameState;

        public ParticleSystem(IEntityManager entityManager, IGameState gameState)
        {
            _entityManager = entityManager;
            _gameState = gameState;
        }

        public void Update(GameTime gameTime)
        {
            if (!_gameState.Active)
                return;

            var elapsed = (float)gameTime.ElapsedGameTime.TotalSeconds;

            foreach (var entity in _entityManager.Entities<IParticle>())
            {
                entity.Particle.Elapsed += elapsed;

                if (entity.Particle.Expired)
                    entity.Destroyed = true;
            }
        }
    }
}