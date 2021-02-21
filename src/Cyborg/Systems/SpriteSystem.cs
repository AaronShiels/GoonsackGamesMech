using System;
using System.Collections.Generic;
using System.Linq;
using Cyborg.Components;
using Cyborg.Core;
using Cyborg.Utilities;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using static Cyborg.Utilities.MathsExtensions;

namespace Cyborg.Systems
{
    public class SpriteSystem : IUpdateSystem, IDrawSystem, IDisposable
    {
        private readonly IReadOnlyCollection<IEntity> _entities;
        private readonly IGameState _gameState;
        private readonly ICamera _camera;
        private readonly GraphicsDevice _graphicsDevice;
        private readonly SpriteBatch _spriteBatch;

        public SpriteSystem(IReadOnlyCollection<IEntity> entities, IGameState gameState, ICamera camera, GraphicsDevice graphicsDevice)
        {
            _entities = entities;
            _gameState = gameState;
            _camera = camera;
            _graphicsDevice = graphicsDevice;
            _spriteBatch = new SpriteBatch(graphicsDevice);
        }

        public void Update(GameTime gameTime)
        {
            if (!_gameState.Active)
                return;

            var elapsed = (float)gameTime.ElapsedGameTime.TotalSeconds;

            var spriteEntities = _entities.OfType<ISprite>();
            foreach (var entity in spriteEntities)
                entity.Sprite.Elapsed += elapsed;
        }

        public void Draw(GameTime gameTime)
        {
            _spriteBatch.Begin(SpriteSortMode.Immediate, null, SamplerState.PointClamp, null, null, null, _camera.Projection);

            var cameraFrame = _camera.Bounds;
            foreach (var entity in _entities.OfType<ISprite>().OrderBy(e => e.Sprite.Order))
            {
                var centre = entity.Body.Position.ToRoundedPoint() + entity.Sprite.Offset;
                var spriteBounds = CreateRectangleFromCentre(centre, entity.Sprite.Frame.Size);
                if (spriteBounds.Right < cameraFrame.Left || spriteBounds.Left > cameraFrame.Right || spriteBounds.Bottom < cameraFrame.Top || spriteBounds.Top > cameraFrame.Bottom)
                    continue;

                _spriteBatch.Draw(entity.Sprite.Texture, spriteBounds.Location.ToVector2(), entity.Sprite.Frame, Color.White, 0f, Vector2.Zero, Vector2.One, SpriteEffects.None, 0f);
            }

            _spriteBatch.End();
        }

        public void Dispose() => _spriteBatch.Dispose();
    }
}