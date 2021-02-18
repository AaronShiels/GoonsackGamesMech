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
        private readonly ICamera _camera;
        private readonly GameState _gameState;

        private Point _lastPosition;
        private float _lastTransitionedAt;

        public CameraSystem(IReadOnlyCollection<IEntity> entities, ICamera camera, GameState gameState)
        {
            _entities = entities;
            _camera = camera;
            _gameState = gameState;
        }

        public void Update(GameTime gameTime)
        {
            var totalSeconds = (float)gameTime.TotalGameTime.TotalSeconds;

            var areas = _entities.OfType<Area>();
            var player = _entities.OfType<Player>().Single();

            var playerCentre = player.Body.Bounds.Center;
            var activeArea = areas
                .Select(a => a.Bounds)
                .Where(b => b.Left <= playerCentre.X && b.Right > playerCentre.X)
                .Where(b => b.Top <= playerCentre.Y && b.Bottom > playerCentre.Y)
                .Single();

            var desiredCameraPosition = activeArea.Center;

            if (_camera.Position != desiredCameraPosition && !_gameState.Transitioning)
            {
                _gameState.Transitioning = true;

                _lastPosition = _camera.Position;
                _lastTransitionedAt = totalSeconds;
            }
            else if (_camera.Position == desiredCameraPosition && _gameState.Transitioning)
            {
                _gameState.Transitioning = false;
            }

            if (!_gameState.Transitioning)
                return;

            var start = _lastPosition.ToVector2();
            var end = desiredCameraPosition.ToVector2();
            var progress = Math.Min((totalSeconds - _lastTransitionedAt) / _transitionTime, 1f);
            var current = Vector2.Lerp(start, end, progress);
            _camera.Position = Vector2.Round(current).ToPoint();
        }
    }
}