using Cyborg.Components;
using Cyborg.Core;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace Cyborg.Systems
{
    public class RenderSystem : IUpdateSystem, IDrawSystem
    {
        private readonly SpriteBatch _spriteBatch;
        private readonly GraphicsDevice _graphicsDevice;
        private readonly IEntityManager _entityManager;
        private readonly Matrix _globalTransform;

        public RenderSystem(SpriteBatch spriteBatch, GraphicsDevice graphicsDevice, IEntityManager entityManager)
        {
            _spriteBatch = spriteBatch;
            _graphicsDevice = graphicsDevice;
            _entityManager = entityManager;

            _globalTransform = ComputeScalingTransform(_graphicsDevice.PresentationParameters.BackBufferWidth, _graphicsDevice.PresentationParameters.BackBufferHeight, Constants.BaseWidth, Constants.BaseHeight);
        }

        public void Update(GameTime gameTime)
        {
            var entities = _entityManager.Get<IAnimatedSprite>();

            var elapsed = (float)gameTime.ElapsedGameTime.TotalSeconds;

            foreach (var entity in entities)
                entity.AnimatedSprite.Update(elapsed);
        }

        public void Draw(GameTime gameTime)
        {
            _graphicsDevice.Clear(Color.CornflowerBlue);

            _spriteBatch.Begin(SpriteSortMode.Immediate, null, SamplerState.PointClamp, null, null, null, _globalTransform);

            var spriteEntities = _entityManager.Get<ISprite>();
            var animatedSpriteEntities = _entityManager.Get<IAnimatedSprite>();

            foreach (var entity in spriteEntities)
                _spriteBatch.Draw(entity.Sprite, entity.Position, null, Color.White, 0f, entity.Size / 2, Vector2.One, SpriteEffects.None, 0f);

            foreach (var entity in animatedSpriteEntities)
                _spriteBatch.Draw(entity.AnimatedSprite.Texture, entity.Position, entity.AnimatedSprite.Frame, Color.White, 0f, entity.Size / 2, Vector2.One, SpriteEffects.None, 0f);

            _spriteBatch.End();
        }

        private static Matrix ComputeScalingTransform(int screenX, int screenY, int baseX, int baseY) => Matrix.CreateScale(new Vector3(screenX / baseX, screenY / baseY, 1));
    }
}