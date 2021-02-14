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
        private const float _playerForce = 800f;
        private const float _attackDuration = 0.2f;
        private const float _dashDuration = 0.5f;
        private const int _dashForceCoefficient = 20;

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
            entity.Kinetic.Force = Vector2.Zero;
            entity.State.Elapsed += elapsed;

            // Finish dash
            if (entity.State.Current == PlayerState.Dashing && entity.State.Elapsed >= _dashDuration)
                entity.State.Current = PlayerState.Standing;

            // Finish attack
            if (entity.State.Current == PlayerState.Attacking && entity.State.Elapsed >= _attackDuration)
                entity.State.Current = PlayerState.Standing;

            // Enter dash
            if (entity.State.Current < PlayerState.Attacking && entity.Controller.Pressed.Contains(Button.Dash))
            {
                entity.State.Current = PlayerState.Dashing;
                if (entity.Controller.Joystick != Vector2.Zero)
                    entity.Direction = entity.Controller.Joystick;
                entity.Kinetic.Force = entity.Direction * _playerForce * _dashForceCoefficient;
            }

            // Enter attack
            if (entity.State.Current < PlayerState.Attacking && entity.Controller.Pressed.Contains(Button.Attack))
            {
                entity.State.Current = PlayerState.Attacking;
                if (entity.Controller.Joystick != Vector2.Zero)
                    entity.Direction = entity.Controller.Joystick;
            }

            // Walk
            if (entity.State.Current < PlayerState.Attacking && entity.Controller.Joystick != Vector2.Zero)
            {
                entity.State.Current = PlayerState.Walking;
                entity.Direction = entity.Controller.Joystick;
                entity.Kinetic.Force = entity.Direction * _playerForce;
            }

            // Stand
            if (entity.State.Current < PlayerState.Attacking && entity.Controller.Joystick == Vector2.Zero)
                entity.State.Current = PlayerState.Standing;
        }

        private void ApplyAnimation(Player entity)
        {
            var cardinalDirection = entity.Direction.ToCardinal();
            switch (entity.State.Current)
            {
                case PlayerState.Dashing:
                case PlayerState.Standing:
                    if (cardinalDirection == Vector2.UnitX)
                        entity.Animation.Current = Player.AnimationStandRight;
                    else if (cardinalDirection == -Vector2.UnitX)
                        entity.Animation.Current = Player.AnimationStandLeft;
                    else if (cardinalDirection == Vector2.UnitY)
                        entity.Animation.Current = Player.AnimationStandDown;
                    else if (cardinalDirection == -Vector2.UnitY)
                        entity.Animation.Current = Player.AnimationStandUp;
                    break;
                case PlayerState.Walking:
                    if (cardinalDirection == Vector2.UnitX)
                        entity.Animation.Current = Player.AnimationWalkRight;
                    else if (cardinalDirection == -Vector2.UnitX)
                        entity.Animation.Current = Player.AnimationWalkLeft;
                    else if (cardinalDirection == Vector2.UnitY)
                        entity.Animation.Current = Player.AnimationWalkDown;
                    else if (cardinalDirection == -Vector2.UnitY)
                        entity.Animation.Current = Player.AnimationWalkUp;
                    break;
                case PlayerState.Attacking:
                    if (cardinalDirection == Vector2.UnitX)
                        entity.Animation.Current = Player.AnimationAttackRight;
                    else if (cardinalDirection == -Vector2.UnitX)
                        entity.Animation.Current = Player.AnimationAttackLeft;
                    else if (cardinalDirection == Vector2.UnitY)
                        entity.Animation.Current = Player.AnimationAttackDown;
                    else if (cardinalDirection == -Vector2.UnitY)
                        entity.Animation.Current = Player.AnimationAttackUp;
                    break;
                default:
                    break;
            }
        }
    }
}