using System;
using System.Collections.Generic;
using System.Linq;
using Cyborg.Components;
using Cyborg.Core;
using Cyborg.Utilities;
using Microsoft.Xna.Framework;

namespace Cyborg.Systems
{
    public class AreaSystem : IUpdateSystem
    {
        private const float _transitionTime = 0.5f;

        private readonly IEntityManager _entityManager;
        private readonly ICamera _camera;
        private readonly IList<IArea> _areas;
        private readonly GameState _gameState;

        private IArea _currentArea;
        private IArea _previousArea;
        private float _transitionElapsed;

        public AreaSystem(IEntityManager entityManager, ICamera camera, IList<IArea> areas, GameState gameState)
        {
            _entityManager = entityManager;
            _camera = camera;
            _areas = areas;
            _gameState = gameState;
        }

        public void Update(GameTime gameTime)
        {
            var elapsed = (float)gameTime.ElapsedGameTime.TotalSeconds;

            CheckAreaTransition();
            ApplyAreaTransition(elapsed);
        }

        public void CheckAreaTransition()
        {
            var playerCentre = _entityManager.Entities<IPlayer>().First().Body.Position.ToRoundedPoint();
            var newArea = _areas.First(a => a.Bounds.Contains(playerCentre));

            if (!_gameState.Transitioning && newArea != _currentArea)
            {
                _gameState.Transitioning = true;

                _previousArea = _currentArea;
                _currentArea = newArea;
                _transitionElapsed = 0;

                _currentArea.Load();
            }

            if (_gameState.Transitioning && _transitionElapsed > _transitionTime)
            {
                _gameState.Transitioning = false;

                _camera.Position = _currentArea.Bounds.Center.ToVector2();

                _previousArea?.Unload();
            }
        }

        public void ApplyAreaTransition(float elapsed)
        {
            if (!_gameState.Transitioning)
                return;

            _transitionElapsed += elapsed;

            var progress = Math.Min(_transitionElapsed / _transitionTime, 1);
            var fromPosition = _previousArea?.Bounds.Center.ToVector2() ?? Vector2.Zero;
            var toPosition = _currentArea.Bounds.Center.ToVector2();
            _camera.Position = Vector2.Lerp(fromPosition, toPosition, progress);
        }
    }
}