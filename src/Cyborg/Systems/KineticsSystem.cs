using System.Collections.Generic;
using System.Linq;
using Cyborg.Components;
using Cyborg.Core;
using Microsoft.Xna.Framework;

namespace Cyborg.Systems
{
    public class KineticsSystem : IUpdateSystem
    {
        // https://www.omnicalculator.com/physics/free-fall-air-resistance#air-resistance-formula
        private const float _dragCoefficient = 0.4f;
        private const float _stoppingThreshold = 10f;
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
                // Apply stopping thresholds
                if (entity.Kinetic.Velocity.Length() < _stoppingThreshold)
                    entity.Kinetic.Velocity = Vector2.Zero;

                // Apply drag to force
                // Fd = kv²
                // F2 = 1 - Fd/F1
                var dragScalar = _dragCoefficient * entity.Kinetic.Velocity.LengthSquared();
                var dragForce = dragScalar > 0
                    ? -dragScalar * Vector2.Normalize(entity.Kinetic.Velocity)
                    : Vector2.Zero;

                entity.Kinetic.Force += dragForce;

                // Apply force to velocity
                // F = ma, a = F/m
                var acceleration = entity.Kinetic.Force / entity.Kinetic.Mass;
                entity.Kinetic.Velocity += acceleration * elapsed;

                // Apply velocity
                entity.Body.Position += entity.Kinetic.Velocity * elapsed;
            }
        }
    }
}