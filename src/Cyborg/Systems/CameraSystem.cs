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
        private Vector2 _lastChangedTo;
        private Vector2 _lastChangedFrom;
        private float _lastChangedAt;

        public CameraSystem(IReadOnlyCollection<IEntity> entities)
        {
            _entities = entities;
        }

        public void Update(GameTime gameTime)
        {
            var totalSeconds = (float)gameTime.TotalGameTime.TotalSeconds;
            var camera = _entities.OfType<Camera>().Single();
            var player = _entities.OfType<Player>().Single();

            var desiredCameraX = player.Position.X + player.Size.X / 2 > 320 ? 480 : 160;
            var desiredCameraY = player.Position.Y + player.Size.Y / 2 > 176 ? 264 : 88;
            var desiredCameraPosition = new Vector2(desiredCameraX, desiredCameraY);

            if (camera.Position == desiredCameraPosition)
                return;

            if (desiredCameraPosition != _lastChangedTo)
            {
                _lastChangedTo = desiredCameraPosition;
                _lastChangedFrom = camera.Position;
                _lastChangedAt = totalSeconds;
            }

            var progress = Math.Min((totalSeconds - _lastChangedAt) / _transitionTime, 1f);
            camera.Position = Vector2.Lerp(_lastChangedFrom, desiredCameraPosition, progress);
        }
    }
}