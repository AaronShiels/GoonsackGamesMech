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
        private const float _walkingAcquisitionRange = 50;
        private const float _walkingForce = 200;
        private const float _explosionsPerSecond = 12;
        private const float _explosionJitter = 10;
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

            foreach (var entity in _entityManager.Entities<IEnemy>())
            {
                CheckStateChange(entity);
                ApplyState(entity, elapsed);
                ApplyAnimation(entity);
            }
        }

        private void CheckStateChange(IEnemy entity)
        {
            var playerEntities = _entityManager.Entities<IPlayer>();
            var targetDistance = playerEntities.Any()
                ? playerEntities
                    .Select(pe => (pe.Body.Position - entity.Body.Position).Length())
                    .OrderBy(d => d)
                    .First()
                : (double?)null;

            // Death
            if (entity.Enemy.Dying && entity.Enemy.DyingElapsed > _deathDuration)
                entity.Destroyed = true;

            if (!entity.Enemy.Dying && entity.Damage.Remaining <= 0)
                entity.Enemy.Dying = true;

            // Walk
            if (entity.Enemy.Walking && (entity.Enemy.Dying || !targetDistance.HasValue || targetDistance.Value > _walkingAcquisitionRange * 1.5))
                entity.Enemy.Walking = false;

            if (!entity.Enemy.Walking && !entity.Enemy.Dying && targetDistance.HasValue && targetDistance.Value < _walkingAcquisitionRange)
                entity.Enemy.Walking = true;
        }

        private void ApplyState(IEnemy entity, float elapsed)
        {
            var targetDirection = _entityManager
                .Entities<IPlayer>()
                .Select(pe => pe.Body.Position - entity.Body.Position)
                .OrderBy(v => v.Length())
                .Select(v => Vector2.Normalize(v))
                .FirstOrDefault();

            // Walk
            if (entity.Enemy.Walking)
            {
                entity.Enemy.Direction = targetDirection;
                entity.Kinetic.Force = entity.Enemy.Direction * _walkingForce;
            }
            else
                entity.Kinetic.Force = Vector2.Zero;


            // Death
            if (entity.Enemy.Dying)
            {
                entity.Enemy.DyingElapsed += elapsed;

                if (entity.Enemy.DyingElapsed % (1 / _explosionsPerSecond) < 0.0166f)
                {
                    var randomPosition = entity.Body.Position + CreateRandomVector2() * _explosionJitter;
                    _entityManager.Create(cm => new Explosion(cm, randomPosition));
                }
            }
        }

        private static void ApplyAnimation(IEnemy entity)
        {
            var cardinalDirection = entity.Enemy.Direction.ToCardinal();
            if (cardinalDirection.X == 1)
                entity.Sprite.Animation = entity.Enemy.Walking ? Zombie.AnimationWalkRight : Zombie.AnimationStandRight;
            else if (cardinalDirection.X == -1)
                entity.Sprite.Animation = entity.Enemy.Walking ? Zombie.AnimationWalkLeft : Zombie.AnimationStandLeft;
            else if (cardinalDirection.Y == 1)
                entity.Sprite.Animation = entity.Enemy.Walking ? Zombie.AnimationWalkDown : Zombie.AnimationStandDown;
            else if (cardinalDirection.Y == -1)
                entity.Sprite.Animation = entity.Enemy.Walking ? Zombie.AnimationWalkUp : Zombie.AnimationStandUp;
        }
    }
}