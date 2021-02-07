using System;
using System.Collections.Generic;
using System.Linq;
using Cyborg.Core;
using Cyborg.Entities;
using Microsoft.Xna.Framework;

namespace Cyborg.Systems
{
    public class CameraSystem : IUpdateSystem
    {
        private const float _transitionTime = 0.5f;
        private readonly IReadOnlyCollection<IEntity> _entities;
        private readonly GameState _gameState;

        private Vector2 _lastPosition;
        private float _lastTransitionedAt;

        public CameraSystem(IReadOnlyCollection<IEntity> entities, GameState gameState)
        {
            _entities = entities;
            _gameState = gameState;
        }

        public void Update(GameTime gameTime)
        {
            var totalSeconds = (float)gameTime.TotalGameTime.TotalSeconds;
            var camera = _entities.OfType<Camera>().Single();
            var player = _entities.OfType<Player>().Single();

            var playerCentre = new Point((int)player.Position.X + player.Size.X / 2, (int)player.Position.Y + player.Size.Y);
            var activeArea = camera.Areas
                .Where(a => a.Left <= playerCentre.X && a.Right > playerCentre.X)
                .Where(a => a.Top <= playerCentre.Y && a.Bottom > playerCentre.Y)
                .First();
            var desiredCameraPosition = activeArea.Center.ToVector2();

            if (camera.Position != desiredCameraPosition && !_gameState.Transitioning)
            {
                _gameState.Transitioning = true;

                _lastPosition = camera.Position;
                _lastTransitionedAt = totalSeconds;
            }
            else if (camera.Position == desiredCameraPosition && _gameState.Transitioning)
            {
                _gameState.Transitioning = false;
            }

            if (!_gameState.Transitioning)
                return;

            var progress = Math.Min((totalSeconds - _lastTransitionedAt) / _transitionTime, 1f);
            camera.Position = Vector2.Lerp(_lastPosition, desiredCameraPosition, progress);
        }
    }
}