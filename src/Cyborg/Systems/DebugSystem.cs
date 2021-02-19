using System;
using System.Collections.Generic;
using System.Linq;
using Cyborg.Components;
using Cyborg.Core;
using Cyborg.Entities;
using Cyborg.Graphics;
using Cyborg.Utilities;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;

namespace Cyborg.Systems
{
    public class DebugSystem : IUpdateSystem, IDrawSystem, IDisposable
    {
        private readonly IReadOnlyCollection<IEntity> _entities;
        private readonly GameState _gameState;
        private readonly ICamera _camera;
        private readonly GraphicsDevice _graphicsDevice;
        private readonly SpriteBatch _spriteBatch;
        private readonly PrimitiveBatch _primitiveBatch;
        private readonly SpriteFont _debugFont;

        public DebugSystem(IReadOnlyCollection<IEntity> entities, GameState gameState, ICamera camera, GraphicsDevice graphicsDevice, ContentManager contentManager)
        {
            _entities = entities;
            _gameState = gameState;
            _camera = camera;
            _graphicsDevice = graphicsDevice;
            _spriteBatch = new SpriteBatch(graphicsDevice);
            _primitiveBatch = new PrimitiveBatch(graphicsDevice);
            _debugFont = contentManager.Load<SpriteFont>("debug_font");
        }

        public void Update(GameTime gameTime)
        {
            var playerEntity = _entities.OfType<Player>().SingleOrDefault();
            if (playerEntity == null || !playerEntity.Controller.Pressed.Contains(Button.Debug))
                return;

            _gameState.Debug = !_gameState.Debug;
        }

        public void Draw(GameTime gameTime)
        {
            if (!_gameState.Debug)
                return;

            _primitiveBatch.Begin(SamplerState.PointClamp);

            var cameraFrame = _camera.Position.ToBounds(Constants.BaseWidth, Constants.BaseHeight);
            foreach (var entity in _entities.OfType<IBody>())
            {
                var playerEntity = entity as Player;
                var color = playerEntity != null && playerEntity.State.Attacking ? Color.Red : Color.Blue;

                var entityFrame = entity.Body.Position.ToBounds(entity.Body.Size);
                if (entityFrame.Right < cameraFrame.Left || entityFrame.Left > cameraFrame.Right || entityFrame.Bottom < cameraFrame.Top || entityFrame.Top > cameraFrame.Bottom)
                    continue;

                var topLeft = entityFrame.Location.ToVector2();
                var topRight = topLeft + new Vector2(entityFrame.Width, 0);
                var bottomLeft = topLeft + new Vector2(0, entityFrame.Height);
                var bottomRight = topLeft + new Vector2(entityFrame.Width, entityFrame.Height);

                if (entity.Body.Edges.HasFlag(Edge.Right))
                    _primitiveBatch.DrawLine(topRight, bottomRight, color);

                if (entity.Body.Edges.HasFlag(Edge.Left))
                    _primitiveBatch.DrawLine(topLeft, bottomLeft, color);

                if (entity.Body.Edges.HasFlag(Edge.Bottom))
                    _primitiveBatch.DrawLine(bottomLeft, bottomRight, color);

                if (entity.Body.Edges.HasFlag(Edge.Top))
                    _primitiveBatch.DrawLine(topLeft, topRight, color);

                if (playerEntity != null && playerEntity.State.Attacking)
                {
                    var cardinalDirection = playerEntity.State.Direction.ToCardinal();
                    Rectangle attackBounds;
                    if (cardinalDirection.X == 1)
                        attackBounds = new Rectangle(Vector2.Round(playerEntity.Body.Position + new Vector2(8, -8)).ToPoint(), new(12, 16));
                    else if (cardinalDirection.X == -1)
                        attackBounds = new Rectangle(Vector2.Round(playerEntity.Body.Position + new Vector2(-20, -8)).ToPoint(), new(12, 16));
                    else if (cardinalDirection.Y == 1)
                        attackBounds = new Rectangle(Vector2.Round(playerEntity.Body.Position + new Vector2(-8, 8)).ToPoint(), new(16, 12));
                    else if (cardinalDirection.Y == -1)
                        attackBounds = new Rectangle(Vector2.Round(playerEntity.Body.Position + new Vector2(-8, -20)).ToPoint(), new(16, 12));
                    else
                        throw new ArgumentOutOfRangeException(nameof(cardinalDirection));

                    _primitiveBatch.DrawRectangle(attackBounds, Color.Green);
                }
            }

            _primitiveBatch.End();

            var debugText = string.Empty;
            _spriteBatch.Begin(SpriteSortMode.Immediate, null, SamplerState.PointClamp);

            _spriteBatch.DrawString(_debugFont, debugText, Vector2.Zero, Color.White);

            _spriteBatch.End();
        }

        public void Dispose()
        {
            _spriteBatch.Dispose();
            _primitiveBatch.Dispose();
        }
    }
}