using System.Collections.Generic;
using System.Linq;
using Cyborg.Components;
using Cyborg.Core;
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

            foreach (var entity in entities.OfType<ISprite>())
            {
                var spriteSheet = _contentManager.Load<Texture2D>(entity.SpriteSheet);
                _spriteBatch.Draw(spriteSheet, entity.Position, entity.SpriteFrame, Color.White, 0f, Vector2.Zero, Vector2.One, SpriteEffects.None, 0f);
            }

            _spriteBatch.End();
        }

        private static Matrix ComputeScalingTransform(float screenX, float screenY, float baseX, float baseY) => Matrix.CreateScale(new Vector3(screenX / baseX, screenY / baseY, 1));
    }
}