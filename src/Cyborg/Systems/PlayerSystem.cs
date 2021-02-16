using System.Collections.Generic;
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
        private const float _walkingForce = 800f;
        private const float _attackDuration = 0.25f;
        private const float _dashDuration = 0.75f;
        private const int _dashInstantaneousVelocity = 400;

        private readonly IReadOnlyCollection<IEntity> _entities;
        private readonly IGameState _gameState;

        public PlayerSystem(IReadOnlyCollection<IEntity> entities, IGameState gameState)
        {
            _entities = entities;
            _gameState = gameState;
        }

        public void Update(GameTime gameTime)
        {
            if (!_gameState.Active)
                return;

            var elapsed = (float)gameTime.ElapsedGameTime.TotalSeconds;

            var playerEntities = _entities.OfType<Player>();
            foreach (var entity in playerEntities)
            {
                ApplyState(entity, elapsed);
                ApplyAnimation(entity);
            }
        }

        private void ApplyState(Player entity, float elapsed)
        {
            // Finish dash
            if (entity.State.Dashing)
            {
                entity.State.DashElapsed += elapsed;
                if (entity.State.DashElapsed >= _dashDuration)
                    entity.State.Dashing = false;
            }

            // Finish attack
            if (entity.State.Attacking)
            {
                entity.State.AttackElapsed += elapsed;
                if (entity.State.AttackElapsed >= _attackDuration)
                    entity.State.Attacking = false;
            }

            // Enter dash
            if (!entity.State.Attacking && !entity.State.Dashing && entity.Controller.Pressed.Contains(Button.Dash))
            {
                entity.State.Dashing = true;
                entity.State.DashElapsed = 0f;

                if (entity.Controller.Joystick != Vector2.Zero)
                    entity.State.Direction = entity.Controller.Joystick;

                entity.Kinetic.Velocity = entity.State.Direction * _dashInstantaneousVelocity;
            }

            // Enter attack
            if (!entity.State.Attacking && !entity.State.Dashing && entity.Controller.Pressed.Contains(Button.Attack))
            {
                entity.State.Attacking = true;
                entity.State.AttackElapsed = 0f;
                entity.State.AttackCounter++;

                if (entity.Controller.Joystick != Vector2.Zero)
                    entity.State.Direction = entity.Controller.Joystick;
            }

            // Walking
            if (!entity.State.Attacking && !entity.State.Dashing && entity.Controller.Joystick != Vector2.Zero)
            {
                entity.State.Walking = true;
                entity.State.Direction = entity.Controller.Joystick;
                entity.Kinetic.Force = entity.State.Direction * _walkingForce;
            }
            else
            {
                entity.State.Walking = false;
                entity.Kinetic.Force = Vector2.Zero;
            }
        }

        private void ApplyAnimation(Player entity)
        {
            var cardinalDirection = entity.State.Direction.ToCardinal();
            if (entity.State.Attacking)
            {
                if (cardinalDirection == Vector2.UnitX)
                    entity.Sprite.Animation = (entity.State.AttackCounter % 2 == 0) ? Player.AnimationAttackRight : Player.AnimationAttack2Right;
                else if (cardinalDirection == -Vector2.UnitX)
                    entity.Sprite.Animation = (entity.State.AttackCounter % 2 == 0) ? Player.AnimationAttackLeft : Player.AnimationAttack2Left;
                else if (cardinalDirection == Vector2.UnitY)
                    entity.Sprite.Animation = (entity.State.AttackCounter % 2 == 0) ? Player.AnimationAttackDown : Player.AnimationAttack2Down;
                else if (cardinalDirection == -Vector2.UnitY)
                    entity.Sprite.Animation = (entity.State.AttackCounter % 2 == 0) ? Player.AnimationAttackUp : Player.AnimationAttack2Up;
            }
            else if (entity.State.Walking)
            {
                if (cardinalDirection == Vector2.UnitX)
                    entity.Sprite.Animation = Player.AnimationWalkRight;
                else if (cardinalDirection == -Vector2.UnitX)
                    entity.Sprite.Animation = Player.AnimationWalkLeft;
                else if (cardinalDirection == Vector2.UnitY)
                    entity.Sprite.Animation = Player.AnimationWalkDown;
                else if (cardinalDirection == -Vector2.UnitY)
                    entity.Sprite.Animation = Player.AnimationWalkUp;
            }
            else
            {
                if (cardinalDirection == Vector2.UnitX)
                    entity.Sprite.Animation = Player.AnimationStandRight;
                else if (cardinalDirection == -Vector2.UnitX)
                    entity.Sprite.Animation = Player.AnimationStandLeft;
                else if (cardinalDirection == Vector2.UnitY)
                    entity.Sprite.Animation = Player.AnimationStandDown;
                else if (cardinalDirection == -Vector2.UnitY)
                    entity.Sprite.Animation = Player.AnimationStandUp;
            }
        }
    }
}