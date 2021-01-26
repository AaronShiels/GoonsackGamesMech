using System.Collections.Generic;
using System.Linq;
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
        private readonly GraphicsDevice _graphicsDevice;
        private readonly IEntityManager _entityManager;
        private readonly Matrix _globalTransform;

        private readonly IDictionary<string, Texture2D> _sprites = new Dictionary<string, Texture2D>();
        private readonly IDictionary<string, AnimationSet> _animationSet = new Dictionary<string, AnimationSet>();

        public SpriteRenderSystem(ContentManager contentManager, SpriteBatch spriteBatch, GraphicsDevice graphicsDevice, IEntityManager entityManager)
        {
            _contentManager = contentManager;
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
                entity.AnimationElapsed += elapsed;
        }

        public void Draw(GameTime gameTime)
        {
            var elapsed = (float)gameTime.ElapsedGameTime.TotalSeconds;

            _graphicsDevice.Clear(Color.CornflowerBlue);

            _spriteBatch.Begin(SpriteSortMode.Immediate, null, SamplerState.PointClamp, null, null, null, _globalTransform);

            DrawMap();
            DrawStatic();
            DrawAnimated(elapsed);

            _spriteBatch.End();
        }

        private void DrawMap()
        {
            var spriteMaps = _entityManager.Get<ISpriteMap>();

            foreach (var spriteMap in spriteMaps)
                foreach (var layer in spriteMap.SpriteMapContainer.Definition.Layers)
                    for (var x = 0; x < layer.Width; x++)
                        for (var y = 0; y < layer.Height; y++)
                        {
                            var textureIndex = layer.Values[x, y] - 1;
                            var textureOffsetX = textureIndex % spriteMap.SpriteMapContainer.Definition.TileSet.Columns * spriteMap.SpriteMapContainer.Definition.TileWidth;
                            var textureOffsetY = textureIndex / spriteMap.SpriteMapContainer.Definition.TileSet.Columns * spriteMap.SpriteMapContainer.Definition.TileHeight;
                            var textureFrame = new Rectangle(textureOffsetX, textureOffsetY, spriteMap.SpriteMapContainer.Definition.TileWidth, spriteMap.SpriteMapContainer.Definition.TileHeight);

                            var tileOffsetX = spriteMap.Position.X + x * spriteMap.SpriteMapContainer.Definition.TileWidth;
                            var tileOffsetY = spriteMap.Position.Y + y * spriteMap.SpriteMapContainer.Definition.TileHeight;
                            var tilePosition = new Vector2(tileOffsetX, tileOffsetY);

                            _spriteBatch.Draw(spriteMap.SpriteMapContainer.Texture, tilePosition, textureFrame, Color.White, 0f, Vector2.Zero, Vector2.One, SpriteEffects.None, 0f);
                        }
        }

        private void DrawStatic()
        {
            var entities = _entityManager.Get<IStaticSprite>();

            foreach (var entity in entities)
            {
                var sprite = GetSprite(entity.Sprite);
                var origin = new Vector2(sprite.Width, sprite.Height) / 2;

                _spriteBatch.Draw(sprite, entity.Position, null, Color.White, 0f, origin, Vector2.One, SpriteEffects.None, 0f);
            }
        }

        private void DrawAnimated(float elapsed)
        {
            var entities = _entityManager.Get<IAnimatedSprite>();

            foreach (var entity in entities)
            {
                var animationSet = GetAnimationSet(entity.AnimationSet);
                var spriteSheetName = animationSet.SpriteSheet.Split('.').First();
                var spriteSheet = GetSprite(spriteSheetName);
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

        private Texture2D GetSprite(string name)
        {
            if (!_sprites.ContainsKey(name))
                _sprites.Add(name, _contentManager.Load<Texture2D>(name));

            return _sprites[name];
        }

        private AnimationSet GetAnimationSet(string name)
        {
            if (!_animationSet.ContainsKey(name))
                _animationSet.Add(name, _contentManager.Load<AnimationSet>(name));

            return _animationSet[name];
        }

        private static Matrix ComputeScalingTransform(float screenX, float screenY, float baseX, float baseY) => Matrix.CreateScale(new Vector3(screenX / baseX, screenY / baseY, 1));
    }
}