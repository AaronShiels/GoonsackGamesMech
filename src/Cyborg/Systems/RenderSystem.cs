using System.Collections.Generic;
using System.Linq;
using Cyborg.Components;
using Cyborg.Core;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;

namespace Cyborg.Systems
{
    public class RenderSystem : IDrawSystem
    {
        private readonly ContentManager _contentManager;
        private readonly SpriteBatch _spriteBatch;
        private readonly GraphicsDevice _graphicsDevice;
        private readonly IEntityManager _entityManager;
        private readonly IDictionary<string, Texture2D> _textureDictionary = new Dictionary<string, Texture2D>();
        private readonly Matrix _globalTransform;

        public RenderSystem(ContentManager contentManager, SpriteBatch spriteBatch, GraphicsDevice graphicsDevice, IEntityManager entityManager)
        {
            _contentManager = contentManager;
            _spriteBatch = spriteBatch;
            _graphicsDevice = graphicsDevice;
            _entityManager = entityManager;

            _globalTransform = ComputeScalingTransform(_graphicsDevice.PresentationParameters.BackBufferWidth, _graphicsDevice.PresentationParameters.BackBufferHeight, Constants.BaseWidth, Constants.BaseHeight);
        }

        public void Draw(GameTime gameTime)
        {
            _graphicsDevice.Clear(Color.CornflowerBlue);

            _spriteBatch.Begin(SpriteSortMode.Immediate, null, null, null, null, null, _globalTransform);

            var entities = _entityManager.Get<ISprite>();

            foreach (var entity in entities)
            {
                if (!_textureDictionary.ContainsKey(entity.Sprite))
                    _textureDictionary.Add(entity.Sprite, _contentManager.Load<Texture2D>(entity.Sprite));

                _spriteBatch.Draw(
                    _textureDictionary[entity.Sprite],
                    entity.Position,
                    null,
                    Color.White,
                    0f,
                    entity.Size / 2,
                    Vector2.One,
                    SpriteEffects.None,
                    0f
                );
            }

            _spriteBatch.End();
        }

        private static Matrix ComputeScalingTransform(int screenX, int screenY, int baseX, int baseY) => Matrix.CreateScale(new Vector3(screenX / baseX, screenY / baseY, 1));
    }
}