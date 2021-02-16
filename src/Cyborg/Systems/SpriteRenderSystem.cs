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
    public class SpriteRenderSystem : IUpdateSystem, IDrawSystem
    {
        private readonly IReadOnlyCollection<IEntity> _entities;
        private readonly IGameState _gameState;
        private readonly SpriteBatch _spriteBatch;
        private readonly GraphicsDevice _graphicsDevice;
        private readonly ContentManager _contentManager;
        private readonly Matrix _globalTransform;

        public SpriteRenderSystem(IReadOnlyCollection<IEntity> entities, IGameState gameState, SpriteBatch spriteBatch, GraphicsDevice graphicsDevice, ContentManager contentManager)
        {
            _entities = entities;
            _gameState = gameState;
            _spriteBatch = spriteBatch;
            _graphicsDevice = graphicsDevice;
            _contentManager = contentManager;
            _globalTransform = ComputeScalingTransform(graphicsDevice.PresentationParameters.BackBufferWidth, graphicsDevice.PresentationParameters.BackBufferHeight, Constants.BaseWidth, Constants.BaseHeight);
        }

        public void Update(GameTime gameTime)
        {
            if (!_gameState.Active)
                return;

            var elapsed = (float)gameTime.ElapsedGameTime.TotalSeconds;

            var spriteEntities = _entities.OfType<ISprite>();
            foreach (var entity in spriteEntities)
                entity.Sprite.Elapsed += elapsed;
        }

        public void Draw(GameTime gameTime)
        {
            _graphicsDevice.Clear(new Color(57, 49, 75));

            _spriteBatch.Begin(SpriteSortMode.Immediate, null, SamplerState.PointClamp, null, null, null, _globalTransform);

            var cameraFrame = GetCameraFrame();
            RenderSprites(cameraFrame);
            RenderDebug(cameraFrame);

            _spriteBatch.End();
        }

        private Rectangle GetCameraFrame()
        {
            var entity = _entities.OfType<Camera>().Single();
            var position = Vector2.Round(entity.Body.Position).ToPoint();

            return new Rectangle(position.X - Constants.BaseWidth / 2, position.Y - Constants.BaseHeight / 2, Constants.BaseWidth, Constants.BaseHeight);
        }

        private void RenderSprites(Rectangle cameraFrame)
        {
            foreach (var entity in _entities.OfType<ISprite>().OrderBy(e => e.Sprite.Order))
            {
                var position = Vector2.Round(entity.Body.Position).ToPoint();
                var frame = new Rectangle(position.X - entity.Sprite.Frame.Width / 2 + entity.Sprite.Offset.X, position.Y - entity.Sprite.Frame.Height / 2 + entity.Sprite.Offset.Y, entity.Sprite.Frame.Width, entity.Sprite.Frame.Height);
                if (frame.Right < cameraFrame.Left || frame.Left > cameraFrame.Right || frame.Bottom < cameraFrame.Top || frame.Top > cameraFrame.Bottom)
                    continue;

                _spriteBatch.Draw(entity.Sprite.Texture, (frame.Location - cameraFrame.Location).ToVector2(), entity.Sprite.Frame, Color.White, 0f, Vector2.Zero, Vector2.One, SpriteEffects.None, 0f);
            }
        }

        private void RenderDebug(Rectangle cameraFrame)
        {
            if (!_gameState.Debug)
                return;

            var debugText = string.Empty;
            var debugFont = _contentManager.Load<SpriteFont>("debug_font");

            var redPixel = new Texture2D(_graphicsDevice, 1, 1);
            redPixel.SetData(new Color[] { Color.Red });
            var bluePixel = new Texture2D(_graphicsDevice, 1, 1);
            bluePixel.SetData(new Color[] { Color.Blue });

            foreach (var entity in _entities.OfType<IBody>())
            {
                var playerEntity = entity as Player;
                var pixel = playerEntity != null && playerEntity.State.Attacking ? redPixel : bluePixel;

                var entityFrame = entity.Body.Bounds;
                if (entityFrame.Right < cameraFrame.Left || entityFrame.Left > cameraFrame.Right || entityFrame.Bottom < cameraFrame.Top || entityFrame.Top > cameraFrame.Bottom)
                    continue;

                if (entity.Body.Edges.HasFlag(Edge.Right))
                    _spriteBatch.Draw(pixel, new Rectangle(entityFrame.Right, entityFrame.Top, 1, entityFrame.Height), Color.White);

                if (entity.Body.Edges.HasFlag(Edge.Left))
                    _spriteBatch.Draw(pixel, new Rectangle(entityFrame.Left, entityFrame.Top, 1, entityFrame.Height), Color.White);

                if (entity.Body.Edges.HasFlag(Edge.Bottom))
                    _spriteBatch.Draw(pixel, new Rectangle(entityFrame.Left, entityFrame.Bottom, entityFrame.Width, 1), Color.White);

                if (entity.Body.Edges.HasFlag(Edge.Top))
                    _spriteBatch.Draw(pixel, new Rectangle(entityFrame.Left, entityFrame.Top, entityFrame.Width, 1), Color.White);

                if (playerEntity != null)
                {
                    debugText = $"{playerEntity.Kinetic.Force.Length():F}\n{playerEntity.Kinetic.Velocity.Length():F}\n{playerEntity.Body.Position.X:F},{playerEntity.Body.Position.Y:F}";
                }
            }

            _spriteBatch.DrawString(debugFont, debugText, Vector2.Zero, Color.White);
        }

        private static Matrix ComputeScalingTransform(float screenX, float screenY, float baseX, float baseY) => Matrix.CreateScale(new Vector3(screenX / baseX, screenY / baseY, 1));
    }
}