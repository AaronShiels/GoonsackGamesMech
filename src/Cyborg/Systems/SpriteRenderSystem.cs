using System.Collections.Generic;
using System.Linq;
using Cyborg.Components;
using Cyborg.Core;
using Cyborg.Entities;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;

namespace Cyborg.Systems
{
    public class SpriteRenderSystem : IDrawSystem
    {
        private readonly ContentManager _contentManager;
        private readonly SpriteBatch _spriteBatch;
        private readonly Matrix _globalTransform;

        public SpriteRenderSystem(ContentManager contentManager, SpriteBatch spriteBatch, GraphicsDevice graphicsDevice)
        {
            _contentManager = contentManager;
            _spriteBatch = spriteBatch;

            _globalTransform = ComputeScalingTransform(graphicsDevice.PresentationParameters.BackBufferWidth, graphicsDevice.PresentationParameters.BackBufferHeight, Constants.BaseWidth, Constants.BaseHeight);
        }

        public void Draw(IEnumerable<IEntity> entities, GameTime gameTime)
        {
            _spriteBatch.Begin(SpriteSortMode.Immediate, null, SamplerState.PointClamp, null, null, null, _globalTransform);

            var cameraEntity = entities.OfType<Camera>().Single();
            var cameraFrame = new Rectangle((int)cameraEntity.Position.X - Constants.BaseWidth / 2, (int)cameraEntity.Position.Y - Constants.BaseHeight / 2, Constants.BaseWidth, Constants.BaseHeight);

            foreach (var entity in entities.OfType<ISprite>())
            {
                var spriteSheet = _contentManager.Load<Texture2D>(entity.SpriteSheet);
                var spriteWidth = entity.SpriteFrame?.Width ?? spriteSheet.Width;
                var spriteHeight = entity.SpriteFrame?.Height ?? spriteSheet.Height;
                var entityFrame = new Rectangle((int)entity.Position.X, (int)entity.Position.Y, spriteWidth, spriteHeight);
                if (entityFrame.Right < cameraFrame.Left || entityFrame.Left > cameraFrame.Right || entityFrame.Bottom < cameraFrame.Top || entityFrame.Top > cameraFrame.Bottom)
                    continue;

                _spriteBatch.Draw(spriteSheet, entity.Position - cameraFrame.Location.ToVector2(), entity.SpriteFrame, Color.White, 0f, Vector2.Zero, Vector2.One, SpriteEffects.None, 0f);
            }

            _spriteBatch.End();
        }

        private static Matrix ComputeScalingTransform(float screenX, float screenY, float baseX, float baseY) => Matrix.CreateScale(new Vector3(screenX / baseX, screenY / baseY, 1));
    }
}