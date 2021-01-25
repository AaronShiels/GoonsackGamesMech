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

            DrawMap();
            DrawStatic();
            DrawAnimated();

            _spriteBatch.End();
        }

        private void DrawMap()
        {
            var spriteMaps = _entityManager.Get<ISpriteMap>();

            foreach (var spriteMap in spriteMaps)
                foreach (var layer in spriteMap.SpriteMap.Definition.Layers)
                    for (var x = 0; x < layer.Width; x++)
                        for (var y = 0; y < layer.Height; y++)
                        {
                            var textureIndex = layer.Values[x, y] - 1;
                            var textureOffsetX = textureIndex % spriteMap.SpriteMap.Definition.TileSet.Columns * spriteMap.SpriteMap.Definition.TileWidth;
                            var textureOffsetY = textureIndex / spriteMap.SpriteMap.Definition.TileSet.Columns * spriteMap.SpriteMap.Definition.TileHeight;
                            var textureFrame = new Rectangle(textureOffsetX, textureOffsetY, spriteMap.SpriteMap.Definition.TileWidth, spriteMap.SpriteMap.Definition.TileHeight);

                            var tileOffsetX = spriteMap.Position.X + x * spriteMap.SpriteMap.Definition.TileWidth;
                            var tileOffsetY = spriteMap.Position.Y + y * spriteMap.SpriteMap.Definition.TileHeight;
                            var tilePosition = new Vector2(tileOffsetX, tileOffsetY);

                            _spriteBatch.Draw(spriteMap.SpriteMap.Texture, tilePosition, textureFrame, Color.White, 0f, Vector2.Zero, Vector2.One, SpriteEffects.None, 0f);
                        }
        }

        private void DrawStatic()
        {
            var staticSprites = _entityManager.Get<IStaticSprite>();

            foreach (var staticSprite in staticSprites)
                _spriteBatch.Draw(staticSprite.StaticSprite.Texture, staticSprite.Position, null, Color.White, 0f, staticSprite.Size / 2, Vector2.One, SpriteEffects.None, 0f);
        }

        private void DrawAnimated()
        {
            var animatedSprites = _entityManager.Get<IAnimatedSprite>();

            foreach (var animatedSprite in animatedSprites)
                _spriteBatch.Draw(animatedSprite.AnimatedSprite.Texture, animatedSprite.Position, animatedSprite.AnimatedSprite.Frame, Color.White, 0f, animatedSprite.Size / 2, Vector2.One, SpriteEffects.None, 0f);
        }

        private static Matrix ComputeScalingTransform(int screenX, int screenY, int baseX, int baseY) => Matrix.CreateScale(new Vector3(screenX / baseX, screenY / baseY, 1));
    }
}