using System;
using System.Linq;
using Cyborg.Components;
using Cyborg.Core;
using Cyborg.Graphics;
using Cyborg.Utilities;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;

namespace Cyborg.Systems
{
    public class DebugSystem : IUpdateSystem, IDrawSystem, IDisposable
    {
        private readonly IEntityManager _entityManager;
        private readonly GameState _gameState;
        private readonly ICamera _camera;
        private readonly SpriteBatch _spriteBatch;
        private readonly PrimitiveBatch _primitiveBatch;
        private readonly SpriteFont _debugFont;

        public DebugSystem(IEntityManager entityManager, GameState gameState, ICamera camera, GraphicsDevice graphicsDevice, ContentManager contentManager)
        {
            _entityManager = entityManager;
            _gameState = gameState;
            _camera = camera;
            _spriteBatch = new SpriteBatch(graphicsDevice);
            _primitiveBatch = new PrimitiveBatch(graphicsDevice);
            _debugFont = contentManager.Load<SpriteFont>("debug_font");
        }

        public void Update(GameTime gameTime)
        {
            var playerEntity = _entityManager.Entities<IPlayer>().SingleOrDefault();
            if (playerEntity == null || !playerEntity.Controller.Pressed.Contains(Button.Debug))
                return;

            _gameState.Debug = !_gameState.Debug;
        }

        public void Draw(GameTime gameTime)
        {
            if (!_gameState.Debug)
                return;

            _primitiveBatch.Begin(SamplerState.PointClamp, _camera.Projection);

            var cameraFrame = _camera.Bounds;
            foreach (var entity in _entityManager.Entities<IBody>())
            {
                var entityFrame = entity.Body.Bounds;
                if (entityFrame.Right < cameraFrame.Left || entityFrame.Left > cameraFrame.Right || entityFrame.Bottom < cameraFrame.Top || entityFrame.Top > cameraFrame.Bottom)
                    continue;

                var topLeft = entityFrame.Location.ToVector2();
                var topRight = topLeft + new Vector2(entityFrame.Width, 0);
                var bottomLeft = topLeft + new Vector2(0, entityFrame.Height);
                var bottomRight = topLeft + new Vector2(entityFrame.Width, entityFrame.Height);

                if (entity.Body.Edges.HasFlag(Edge.Right))
                    _primitiveBatch.DrawLine(topRight, bottomRight, Color.Blue);

                if (entity.Body.Edges.HasFlag(Edge.Left))
                    _primitiveBatch.DrawLine(topLeft, bottomLeft, Color.Blue);

                if (entity.Body.Edges.HasFlag(Edge.Bottom))
                    _primitiveBatch.DrawLine(bottomLeft, bottomRight, Color.Blue);

                if (entity.Body.Edges.HasFlag(Edge.Top))
                    _primitiveBatch.DrawLine(topLeft, topRight, Color.Blue);
            }

            foreach (var entity in _entityManager.Entities<IPlayer>())
            {
                if (!entity.Player.Attacking)
                    return;

                var sector = new Sector(entity.Body.Position.ToRoundedPoint(), entity.Player.AttackRadius, entity.Player.AttackAngles.Minimum, entity.Player.AttackAngles.Maximum);
                _primitiveBatch.Draw(sector, Color.Red);

            }

            _primitiveBatch.End();

            _spriteBatch.Begin(SpriteSortMode.Immediate, null, SamplerState.PointClamp);

            _spriteBatch.DrawString(_debugFont, $"Entities: {_entityManager.Entities<IEntity>().Count()}", Vector2.Zero, Color.White);

            _spriteBatch.End();
        }

        public void Dispose()
        {
            _spriteBatch.Dispose();
            _primitiveBatch.Dispose();
        }
    }
}