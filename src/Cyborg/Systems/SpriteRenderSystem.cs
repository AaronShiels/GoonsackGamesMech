using System;
using Cyborg.Components;
using Cyborg.ContentPipeline;
using Cyborg.Core;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;

namespace Cyborg.Systems
{
    public class SpriteRenderSystem : IUpdateSystem, IDrawSystem
    {
        private const int _frameRate = 4;

        private readonly ContentManager _contentManager;
        private readonly SpriteBatch _spriteBatch;
        private readonly IEntityManager _entityManager;
        private readonly Matrix _globalTransform;

        public SpriteRenderSystem(ContentManager contentManager, SpriteBatch spriteBatch, GraphicsDevice graphicsDevice, IEntityManager entityManager)
        {
            _contentManager = contentManager;
            _spriteBatch = spriteBatch;
            _entityManager = entityManager;

            _globalTransform = ComputeScalingTransform(graphicsDevice.PresentationParameters.BackBufferWidth, graphicsDevice.PresentationParameters.BackBufferHeight, Constants.BaseWidth, Constants.BaseHeight);
        }

        public void Update(GameTime gameTime)
        {
            var entities = _entityManager.Get<IAnimatedSprite>();

            var elapsed = (float)gameTime.ElapsedGameTime.TotalSeconds;

            foreach (var entity in entities)
                entity.AnimationElapsed += elapsed;
        }

        public void Draw(GameTime gameTime)
        {
            _spriteBatch.Begin(SpriteSortMode.Immediate, null, SamplerState.PointClamp, null, null, null, _globalTransform);

            DrawMap();
            DrawStatic();
            DrawAnimated();

            _spriteBatch.End();
        }

        private void DrawMap()
        {
            var entities = _entityManager.Get<ISpriteMap>();

            foreach (var entity in entities)
            {
                var spriteMap = _contentManager.Load<SpriteMap>(entity.SpriteMap);
                var spriteSheet = _contentManager.Load<Texture2D>(spriteMap.SpriteSheet);

                var backgroundMapWidth = spriteMap.BackgroundMap.GetLength(0);
                var backgroundMapHeight = spriteMap.BackgroundMap.GetLength(1);
                var collisionMapWidth = spriteMap.CollisionMap.GetLength(0);
                var collisionMapHeight = spriteMap.CollisionMap.GetLength(1);

                var width = Math.Max(backgroundMapWidth, collisionMapWidth);
                var height = Math.Max(backgroundMapHeight, collisionMapHeight);

                for (var x = 0; x < width; x++)
                    for (var y = 0; y < height; y++)
                    {
                        // Use collision texture or fallback to background if 0
                        var tileTextureIndex = x < collisionMapWidth && y < collisionMapHeight && spriteMap.CollisionMap[x, y] > 0
                            ? spriteMap.CollisionMap[x, y]
                            : spriteMap.BackgroundMap[x, y];
                        var textureOffsetX = (tileTextureIndex - 1) * spriteMap.TileWidth % spriteSheet.Width;
                        var textureOffsetY = (tileTextureIndex - 1) * spriteMap.TileWidth / spriteSheet.Width * spriteMap.TileHeight;
                        var textureFrame = new Rectangle(textureOffsetX, textureOffsetY, spriteMap.TileWidth, spriteMap.TileHeight);

                        var tileOffsetX = entity.Position.X + x * spriteMap.TileWidth;
                        var tileOffsetY = entity.Position.Y + y * spriteMap.TileHeight;
                        var tilePosition = new Vector2(tileOffsetX, tileOffsetY);

                        _spriteBatch.Draw(spriteSheet, tilePosition, textureFrame, Color.White, 0f, Vector2.Zero, Vector2.One, SpriteEffects.None, 0f);
                    }
            }
        }

        private void DrawStatic()
        {
            var entities = _entityManager.Get<IStaticSprite>();

            foreach (var entity in entities)
            {
                var sprite = _contentManager.Load<Texture2D>(entity.Sprite);
                var origin = new Vector2(sprite.Width, sprite.Height) / 2;

                _spriteBatch.Draw(sprite, entity.Position, null, Color.White, 0f, origin, Vector2.One, SpriteEffects.None, 0f);
            }
        }

        private void DrawAnimated()
        {
            var entities = _entityManager.Get<IAnimatedSprite>();

            foreach (var entity in entities)
            {
                var animationSet = _contentManager.Load<AnimationSet>(entity.AnimationSet);
                var spriteSheet = _contentManager.Load<Texture2D>(animationSet.SpriteSheet);
                var animation = animationSet.Animations[entity.Animation];
                var currentAnimationFrameIndex = (int)(entity.AnimationElapsed * _frameRate) % animation.Length;
                var spriteSheetFrameIndex = animation[currentAnimationFrameIndex];
                var offsetX = spriteSheetFrameIndex * animationSet.FrameWidth % spriteSheet.Width;
                var offsetY = spriteSheetFrameIndex * animationSet.FrameWidth / spriteSheet.Width * animationSet.FrameHeight;
                var rectangle = new Rectangle(offsetX, offsetY, animationSet.FrameWidth, animationSet.FrameHeight);
                var origin = new Vector2(animationSet.FrameWidth, animationSet.FrameHeight) / 2;

                _spriteBatch.Draw(spriteSheet, entity.Position, rectangle, Color.White, 0f, origin, Vector2.One, SpriteEffects.None, 0f);
            }
        }

        private static Matrix ComputeScalingTransform(float screenX, float screenY, float baseX, float baseY) => Matrix.CreateScale(new Vector3(screenX / baseX, screenY / baseY, 1));
    }
}