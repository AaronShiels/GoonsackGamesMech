using System;
using System.Linq;
using Cyborg.Components;
using Cyborg.Core;
using Cyborg.Entities;
using Cyborg.Utilities;
using Microsoft.Xna.Framework;

namespace Cyborg.Systems
{
    public class CameraSystem : IUpdateSystem
    {
        private const float _transitionTime = 0.5f;

        private readonly IEntityManager _entityManager;
        private readonly ICamera _camera;
        private readonly GameState _gameState;

        private Vector2 _lastPosition;
        private float _lastTransitionedAt;

        public CameraSystem(IEntityManager entityManager, ICamera camera, GameState gameState)
        {
            _entityManager = entityManager;
            _camera = camera;
            _gameState = gameState;
        }

        public void Update(GameTime gameTime)
        {
            var totalSeconds = (float)gameTime.TotalGameTime.TotalSeconds;

            var playerCentre = _entityManager.Entities<IPlayer>().First().Body.Position.ToRoundedPoint();
            var activeArea = _entityManager.Entities<Area>()
                .Select(a => a.Bounds)
                .Where(b => b.Left <= playerCentre.X && b.Right > playerCentre.X)
                .Where(b => b.Top <= playerCentre.Y && b.Bottom > playerCentre.Y)
                .Single();

            var desiredCameraPosition = activeArea.Center.ToVector2();

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

            var progress = Math.Min((totalSeconds - _lastTransitionedAt) / _transitionTime, 1f);
            _camera.Position = Vector2.Lerp(_lastPosition, desiredCameraPosition, progress);
        }
    }
}