using System;
using System.Collections.Generic;
using System.Linq;
using Cyborg.Components;
using Cyborg.Core;
using Cyborg.Entities;
using Cyborg.Utilities;
using Microsoft.Xna.Framework;
using static Cyborg.Utilities.MathsExtensions;

namespace Cyborg.Systems
{
    public class EnemySystem : IUpdateSystem
    {
        private const float _walkingForce = 200f;
        private const float _explosionsPerSecond = 12f;
        private const float _explosionJitter = 10f;
        private const float _deathDuration = 0.5f;

        private readonly IEntityManager _entityManager;
        private readonly IGameState _gameState;

        public EnemySystem(IEntityManager entityManager, IGameState gameState)
        {
            _entityManager = entityManager;
            _gameState = gameState;
        }

        public void Update(GameTime gameTime)
        {
            if (!_gameState.Active)
                return;

            var elapsed = (float)gameTime.ElapsedGameTime.TotalSeconds;

            var playerEntities = _entityManager.Entities<IPlayer>();

            foreach (var entity in _entityManager.Entities<IEnemy>())
            {
                CalculateState(entity, playerEntities, elapsed);
                ApplyAnimation(entity);
            }
        }

        private void CalculateState(IEnemy entity, IEnumerable<IPlayer> playerEntities, float elapsed)
        {
            // Enter dead
            if (entity.Damage.Remaining <= 0 && !entity.Enemy.Dying)
            {
                entity.Enemy.Dying = true;
            }

            // Walking
            if (!entity.Enemy.Dying)
            {
                var enemyToClosestPlayerVector = playerEntities
                    .Select(pe => pe.Body.Position - entity.Body.Position)
                    .OrderBy(v => v.Length())
                    .FirstOrDefault();

                if (enemyToClosestPlayerVector != default)
                {
                    entity.Enemy.Direction = Vector2.Normalize(enemyToClosestPlayerVector);
                    entity.Kinetic.Force = entity.Enemy.Direction * _walkingForce;
                }
            }

            if (entity.Enemy.Dying)
            {
                if (entity.Enemy.DyingElapsed % (1 / _explosionsPerSecond) < 0.0166f)
                {
                    var randomPosition = entity.Body.Position + CreateRandomVector2() * _explosionJitter;
                    _entityManager.Create(cm => new Explosion(cm, randomPosition));
                }

                if (entity.Enemy.DyingElapsed > _deathDuration)
                {
                    entity.Destroyed = true;
                }
                else
                {
                    entity.Enemy.DyingElapsed += elapsed;
                    entity.Kinetic.Force = Vector2.Zero;
                }
            }
        }

        private static void ApplyAnimation(IEnemy entity)
        {
            var cardinalDirection = entity.Enemy.Direction.ToCardinal();
            if (cardinalDirection.X == 1)
                entity.Sprite.Animation = Zombie.AnimationWalkRight;
            else if (cardinalDirection.X == -1)
                entity.Sprite.Animation = Zombie.AnimationWalkLeft;
            else if (cardinalDirection.Y == 1)
                entity.Sprite.Animation = Zombie.AnimationWalkDown;
            else if (cardinalDirection.Y == -1)
                entity.Sprite.Animation = Zombie.AnimationWalkUp;
        }
    }
}