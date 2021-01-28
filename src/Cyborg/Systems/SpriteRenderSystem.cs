using System.Collections.Generic;
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

        private readonly IDictionary<string, Texture2D> _sprites = new Dictionary<string, Texture2D>();
        private readonly IDictionary<string, AnimationSet> _animationSets = new Dictionary<string, AnimationSet>();
        private readonly IDictionary<string, SpriteMap> _spriteMaps = new Dictionary<string, SpriteMap>();

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
                var spriteMap = GetSpriteMap(entity.SpriteMap);
                var spriteSheet = GetSprite(spriteMap.SpriteSheet);
                for (var x = 0; x < spriteMap.Width; x++)
                    for (var y = 0; y < spriteMap.Height; y++)
                    {
                        var tileTextureIndex = spriteMap.BackgroundMap[x, y] - 1;
                        var textureOffsetX = tileTextureIndex * spriteMap.TileWidth % spriteSheet.Width;
                        var textureOffsetY = tileTextureIndex * spriteMap.TileWidth / spriteSheet.Width * spriteMap.TileHeight;
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
                var sprite = GetSprite(entity.Sprite);
                var origin = new Vector2(sprite.Width, sprite.Height) / 2;

                _spriteBatch.Draw(sprite, entity.Position, null, Color.White, 0f, origin, Vector2.One, SpriteEffects.None, 0f);
            }
        }

        private void DrawAnimated()
        {
            var entities = _entityManager.Get<IAnimatedSprite>();

            foreach (var entity in entities)
            {
                var animationSet = GetAnimationSet(entity.AnimationSet);
                var spriteSheet = GetSprite(animationSet.SpriteSheet);
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
            if (!_animationSets.ContainsKey(name))
                _animationSets.Add(name, _contentManager.Load<AnimationSet>(name));

            return _animationSets[name];
        }

        private SpriteMap GetSpriteMap(string name)
        {
            if (!_spriteMaps.ContainsKey(name))
                _spriteMaps.Add(name, _contentManager.Load<SpriteMap>(name));

            return _spriteMaps[name];
        }

        private static Matrix ComputeScalingTransform(float screenX, float screenY, float baseX, float baseY) => Matrix.CreateScale(new Vector3(screenX / baseX, screenY / baseY, 1));
    }
}