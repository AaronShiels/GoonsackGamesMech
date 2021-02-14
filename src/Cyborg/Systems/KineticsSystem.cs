using System.Collections.Generic;
using System.Linq;
using Cyborg.Components;
using Cyborg.Core;
using Microsoft.Xna.Framework;

namespace Cyborg.Systems
{
    public class KineticsSystem : IUpdateSystem
    {
        private const float _frictionCoefficient = 10f;
        private const float _stoppingThreshold = 1f;

        private readonly IReadOnlyCollection<IEntity> _entities;
        private readonly IGameState _gameState;

        public KineticsSystem(IReadOnlyCollection<IEntity> entities, IGameState gameState)
        {
            _entities = entities;
            _gameState = gameState;
        }

        public void Update(GameTime gameTime)
        {
            if (!_gameState.Active)
                return;

            var elapsed = (float)gameTime.ElapsedGameTime.TotalSeconds;
            var kineticEntities = _entities.OfType<IKinetic>();

            foreach (var entity in kineticEntities)
            {
                // Friction force
                // F = fv
                var frictionForce = entity.Kinetic.Velocity != Vector2.Zero
                    ? _frictionCoefficient * entity.Kinetic.Velocity.Length() * Vector2.Normalize(entity.Kinetic.Velocity)
                    : Vector2.Zero;

                // Apply force to velocity
                // F = ma, a = F/m
                var acceleration = (entity.Kinetic.Force - frictionForce) / entity.Kinetic.Mass;
                entity.Kinetic.Velocity += acceleration * elapsed;

                // Apply stopping thresholds
                if (entity.Kinetic.Velocity.Length() < _stoppingThreshold)
                    entity.Kinetic.Velocity = Vector2.Zero;

                // Apply velocity
                entity.Body.Position += entity.Kinetic.Velocity * elapsed;
            }
        }
    }
}