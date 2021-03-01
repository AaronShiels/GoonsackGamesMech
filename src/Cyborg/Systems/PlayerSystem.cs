using System;
using System.Linq;
using Cyborg.Components;
using Cyborg.Core;
using Cyborg.Entities;
using Cyborg.Utilities;
using Microsoft.Xna.Framework;

namespace Cyborg.Systems
{
    public class PlayerSystem : IUpdateSystem
    {
        private const float _walkingForce = 600f;
        private const float _attackDuration = 0.25f;
        private const float _attackKnockbackVelocity = 400f;
        private const float _dashDuration = 0.75f;
        private const float _dashInstantaneousVelocity = 400f;
        private readonly IEntityManager _entityManager;
        private readonly IGameState _gameState;

        public PlayerSystem(IEntityManager entityManager, IGameState gameState)
        {
            _entityManager = entityManager;
            _gameState = gameState;
        }

        public void Update(GameTime gameTime)
        {
            if (!_gameState.Active)
                return;

            var elapsed = (float)gameTime.ElapsedGameTime.TotalSeconds;

            foreach (var entity in _entityManager.Entities<IPlayer>())
            {
                CheckStateChange(entity);
                ApplyState(entity, elapsed);
                ApplyAnimation(entity);
            }
        }

        private static void CheckStateChange(IPlayer entity)
        {
            // Dash
            if (entity.Player.Dashing && entity.Player.DashElapsed >= _dashDuration)
                entity.Player.Dashing = false;

            if (!entity.Player.Dashing && !entity.Player.Attacking && entity.Controller.Pressed.Contains(Button.Dash))
            {
                entity.Player.Dashing = true;
                entity.Player.DashElapsed = 0f;

                if (entity.Controller.Joystick != Vector2.Zero)
                    entity.Player.Direction = entity.Controller.Joystick;

                entity.Kinetic.Velocity = entity.Player.Direction * _dashInstantaneousVelocity;
            }

            // Attack
            if (entity.Player.Attacking && entity.Player.AttackElapsed >= _attackDuration)
                entity.Player.Attacking = false;

            if (!entity.Player.Attacking && entity.Controller.Pressed.Contains(Button.Attack))
            {
                entity.Player.Attacking = true;
                entity.Player.AttackElapsed = 0f;
                entity.Player.AttackCounter++;

                if (entity.Controller.Joystick != Vector2.Zero)
                    entity.Player.Direction = entity.Controller.Joystick;

                var cardinalDirection = entity.Player.Direction.ToCardinal();
                double baseAttackAngle = 0;
                if (cardinalDirection.X == 1)
                    baseAttackAngle = 0;
                else if (cardinalDirection.X == -1)
                    baseAttackAngle = Math.PI;
                else if (cardinalDirection.Y == 1)
                    baseAttackAngle = 0.5 * Math.PI;
                else if (cardinalDirection.Y == -1)
                    baseAttackAngle = 1.5 * Math.PI;

                var adjustedAttackAngle = baseAttackAngle + 0.125 * Math.PI * ((entity.Player.AttackCounter % 2 == 0) ? 1 : -1);
                var attackSector = (adjustedAttackAngle - 0.3125 * Math.PI, adjustedAttackAngle + 0.3125 * Math.PI);
                entity.Player.AttackAngles = attackSector;
            }

            // Walk
            if (!entity.Player.Walking && !entity.Player.Attacking && !entity.Player.Dashing && entity.Controller.Joystick != Vector2.Zero)
                entity.Player.Walking = true;

            if (entity.Player.Walking && (entity.Player.Attacking || entity.Player.Dashing || entity.Controller.Joystick == Vector2.Zero))
                entity.Player.Walking = false;
        }

        private void ApplyState(IPlayer entity, float elapsed)
        {
            // Dash
            if (entity.Player.Dashing)
                entity.Player.DashElapsed += elapsed;

            // Attack
            if (entity.Player.Attacking)
            {
                entity.Player.AttackElapsed += elapsed;

                var attackBounds = new Sector(entity.Body.Position.ToRoundedPoint(), entity.Player.AttackRadius, entity.Player.AttackAngles.Minimum, entity.Player.AttackAngles.Maximum);
                foreach (var enemyEntity in _entityManager.Entities<IEnemy>())
                {
                    if (!attackBounds.Intersects(enemyEntity.Body.Bounds))
                        continue;

                    if (!enemyEntity.Damage.TryApply(1))
                        continue;

                    var knockbackVector = Vector2.Normalize(enemyEntity.Body.Position - entity.Body.Position);
                    enemyEntity.Kinetic.Velocity = knockbackVector * _attackKnockbackVelocity;
                }
            }

            // Walk
            if (entity.Player.Walking)
            {
                if (entity.Controller.Joystick != Vector2.Zero)
                    entity.Player.Direction = entity.Controller.Joystick;

                entity.Kinetic.Force = entity.Player.Direction * _walkingForce;
            }
            else
                entity.Kinetic.Force = Vector2.Zero;
        }

        private static void ApplyAnimation(IPlayer entity)
        {
            var cardinalDirection = entity.Player.Direction.ToCardinal();
            if (entity.Player.Attacking)
            {
                if (cardinalDirection.X == 1)
                    entity.Sprite.Animation = (entity.Player.AttackCounter % 2 == 0) ? CyborgHero.AnimationAttackRight : CyborgHero.AnimationAttack2Right;
                else if (cardinalDirection.X == -1)
                    entity.Sprite.Animation = (entity.Player.AttackCounter % 2 == 0) ? CyborgHero.AnimationAttackLeft : CyborgHero.AnimationAttack2Left;
                else if (cardinalDirection.Y == 1)
                    entity.Sprite.Animation = (entity.Player.AttackCounter % 2 == 0) ? CyborgHero.AnimationAttackDown : CyborgHero.AnimationAttack2Down;
                else if (cardinalDirection.Y == -1)
                    entity.Sprite.Animation = (entity.Player.AttackCounter % 2 == 0) ? CyborgHero.AnimationAttackUp : CyborgHero.AnimationAttack2Up;
            }
            else if (entity.Player.Walking)
            {
                if (cardinalDirection.X == 1)
                    entity.Sprite.Animation = CyborgHero.AnimationWalkRight;
                else if (cardinalDirection.X == -1)
                    entity.Sprite.Animation = CyborgHero.AnimationWalkLeft;
                else if (cardinalDirection.Y == 1)
                    entity.Sprite.Animation = CyborgHero.AnimationWalkDown;
                else if (cardinalDirection.Y == -1)
                    entity.Sprite.Animation = CyborgHero.AnimationWalkUp;
            }
            else
            {
                if (cardinalDirection.X == 1)
                    entity.Sprite.Animation = CyborgHero.AnimationStandRight;
                else if (cardinalDirection.X == -1)
                    entity.Sprite.Animation = CyborgHero.AnimationStandLeft;
                else if (cardinalDirection.Y == 1)
                    entity.Sprite.Animation = CyborgHero.AnimationStandDown;
                else if (cardinalDirection.Y == -1)
                    entity.Sprite.Animation = CyborgHero.AnimationStandUp;
            }
        }
    }
}