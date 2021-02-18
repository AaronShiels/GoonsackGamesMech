using System.Collections.Generic;
using System.Linq;
using Cyborg.Components;
using Cyborg.Core;
using Cyborg.Entities;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace Cyborg.Systems
{
    public class SpriteSystem : IUpdateSystem, IDrawSystem
    {
        private readonly IReadOnlyCollection<IEntity> _entities;
        private readonly IGameState _gameState;
        private readonly ICamera _camera;
        private readonly SpriteBatch _spriteBatch;

        public SpriteSystem(IReadOnlyCollection<IEntity> entities, IGameState gameState, ICamera camera, GraphicsDevice graphicsDevice)
        {
            _entities = entities;
            _gameState = gameState;
            _camera = camera;
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
            _spriteBatch.Begin(SpriteSortMode.Immediate, null, SamplerState.PointClamp, null, null, null, _camera.Transform);

            var cameraFrame = _camera.Bounds;
            foreach (var entity in _entities.OfType<ISprite>().OrderBy(e => e.Sprite.Order))
            {
                var position = Vector2.Round(entity.Body.Position).ToPoint();
                var frame = new Rectangle(position.X - entity.Sprite.Frame.Width / 2 + entity.Sprite.Offset.X, position.Y - entity.Sprite.Frame.Height / 2 + entity.Sprite.Offset.Y, entity.Sprite.Frame.Width, entity.Sprite.Frame.Height);
                if (frame.Right < cameraFrame.Left || frame.Left > cameraFrame.Right || frame.Bottom < cameraFrame.Top || frame.Top > cameraFrame.Bottom)
                    continue;

                _spriteBatch.Draw(entity.Sprite.Texture, (frame.Location - cameraFrame.Location).ToVector2(), entity.Sprite.Frame, Color.White, 0f, Vector2.Zero, Vector2.One, SpriteEffects.None, 0f);
            }

            _spriteBatch.End();
        }
    }
}