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
        private const float _dragCoefficient = 0.2f;
        private const float _stoppingThreshold = 10f;
        private readonly IReadOnlyCollection<IEntity> _entities;

        public KineticsSystem(IReadOnlyCollection<IEntity> entities)
        {
            _entities = entities;
        }

        public void Update(GameTime gameTime)
        {
            var elapsed = (float)gameTime.ElapsedGameTime.TotalSeconds;

            foreach (var entity in _entities.OfType<IKinetic>())
            {
                // Apply stopping thresholds
                if (entity.Velocity.Length() < _stoppingThreshold)
                    entity.Velocity = Vector2.Zero;

                // Apply drag to force
                // Fd = kv²
                // F2 = 1 - Fd/F1
                var dragScalar = _dragCoefficient * entity.Velocity.LengthSquared();
                var dragForce = dragScalar > 0
                    ? -dragScalar * Vector2.Normalize(entity.Velocity)
                    : Vector2.Zero;

                entity.Force += dragForce;

                // Apply force to velocity
                // F = ma, a = F/m
                var acceleration = entity.Force / entity.Mass;
                entity.Velocity += acceleration * elapsed;

                // Apply velocity
                entity.Position += entity.Velocity * elapsed;
            }
        }
    }
}