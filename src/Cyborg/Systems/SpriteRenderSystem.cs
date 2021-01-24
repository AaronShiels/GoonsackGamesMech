using Cyborg.Components;
using Cyborg.Core;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace Cyborg.Systems
{
    public class SpriteRenderSystem : IUpdateSystem, IDrawSystem
    {
        private readonly SpriteBatch _spriteBatch;
        private readonly GraphicsDevice _graphicsDevice;
        private readonly IEntityManager _entityManager;
        private readonly Matrix _globalTransform;

        public SpriteRenderSystem(SpriteBatch spriteBatch, GraphicsDevice graphicsDevice, IEntityManager entityManager)
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

            DrawStatic();
            DrawAnimated();

            _spriteBatch.End();
        }

        private void DrawStatic()
        {
            var entities = _entityManager.Get<ISprite>();

            foreach (var entity in entities)
                _spriteBatch.Draw(entity.Sprite, entity.Position, null, Color.White, 0f, entity.Size / 2, Vector2.One, SpriteEffects.None, 0f);
        }

        private void DrawAnimated()
        {
            var entities = _entityManager.Get<IAnimatedSprite>();

            foreach (var entity in entities)
                _spriteBatch.Draw(entity.AnimatedSprite.Texture, entity.Position, entity.AnimatedSprite.Frame, Color.White, 0f, entity.Size / 2, Vector2.One, SpriteEffects.None, 0f);
        }

        private static Matrix ComputeScalingTransform(int screenX, int screenY, int baseX, int baseY) => Matrix.CreateScale(new Vector3(screenX / baseX, screenY / baseY, 1));
    }
}