using System.Collections.Generic;
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

        public RenderSystem(ContentManager contentManager, SpriteBatch spriteBatch, GraphicsDevice graphicsDevice, IEntityManager entityManager)
        {
            _contentManager = contentManager;
            _spriteBatch = spriteBatch;
            _graphicsDevice = graphicsDevice;
            _entityManager = entityManager;
        }

        public void Draw(GameTime gameTime)
        {
            _graphicsDevice.Clear(Color.CornflowerBlue);

            _spriteBatch.Begin();

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
    }
}