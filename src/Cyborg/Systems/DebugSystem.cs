using System;
using System.Collections.Generic;
using System.Linq;
using Cyborg.Components;
using Cyborg.Core;
using Cyborg.Entities;
using Cyborg.Utilities;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;

namespace Cyborg.Systems
{
    public class DebugSystem : IUpdateSystem, IDrawSystem
    {
        private readonly IReadOnlyCollection<IEntity> _entities;
        private readonly GameState _gameState;
        private readonly ICamera _camera;
        private readonly SpriteBatch _spriteBatch;

        private readonly SpriteFont _debugFont;
        private readonly Texture2D _redPixel;
        private readonly Texture2D _bluePixel;
        private readonly Texture2D _greenPixel;

        public DebugSystem(IReadOnlyCollection<IEntity> entities, GameState gameState, ICamera camera, GraphicsDevice graphicsDevice, ContentManager contentManager)
        {
            _entities = entities;
            _gameState = gameState;
            _camera = camera;

            _spriteBatch = new SpriteBatch(graphicsDevice);
            _debugFont = contentManager.Load<SpriteFont>("debug_font");
            _redPixel = new Texture2D(graphicsDevice, 1, 1);
            _redPixel.SetData(new Color[] { Color.Red });
            _bluePixel = new Texture2D(graphicsDevice, 1, 1);
            _bluePixel.SetData(new Color[] { Color.Blue });
            _greenPixel = new Texture2D(graphicsDevice, 1, 1);
            _greenPixel.SetData(new Color[] { Color.Green });
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

            _spriteBatch.Begin(SpriteSortMode.Immediate, null, SamplerState.PointClamp, null, null, null, _camera.Transform);

            var debugText = string.Empty;

            var cameraFrame = _camera.Bounds;
            foreach (var entity in _entities.OfType<IBody>())
            {
                var playerEntity = entity as Player;
                var pixel = playerEntity != null && playerEntity.State.Attacking ? _redPixel : _bluePixel;

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

                if (playerEntity != null && playerEntity.State.Attacking)
                {
                    var cardinalDirection = playerEntity.State.Direction.ToCardinal();
                    Rectangle attackFrame;
                    if (cardinalDirection.X == 1)
                        attackFrame = new Rectangle(Vector2.Round(playerEntity.Body.Position + new Vector2(8, -8)).ToPoint(), new(12, 16));
                    else if (cardinalDirection.X == -1)
                        attackFrame = new Rectangle(Vector2.Round(playerEntity.Body.Position + new Vector2(-20, -8)).ToPoint(), new(12, 16));
                    else if (cardinalDirection.Y == 1)
                        attackFrame = new Rectangle(Vector2.Round(playerEntity.Body.Position + new Vector2(-8, 8)).ToPoint(), new(16, 12));
                    else if (cardinalDirection.Y == -1)
                        attackFrame = new Rectangle(Vector2.Round(playerEntity.Body.Position + new Vector2(-8, -20)).ToPoint(), new(16, 12));
                    else
                        throw new ArgumentOutOfRangeException(nameof(cardinalDirection));

                    _spriteBatch.Draw(_greenPixel, new Rectangle(attackFrame.Right, attackFrame.Top, 1, attackFrame.Height), Color.White);
                    _spriteBatch.Draw(_greenPixel, new Rectangle(attackFrame.Left, attackFrame.Top, 1, attackFrame.Height), Color.White);
                    _spriteBatch.Draw(_greenPixel, new Rectangle(attackFrame.Left, attackFrame.Bottom, attackFrame.Width, 1), Color.White);
                    _spriteBatch.Draw(_greenPixel, new Rectangle(attackFrame.Left, attackFrame.Top, attackFrame.Width, 1), Color.White);
                }
            }

            _spriteBatch.DrawString(_debugFont, debugText, Vector2.Zero, Color.White);

            _spriteBatch.End();
        }
    }
}