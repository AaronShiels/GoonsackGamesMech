using System;
using Cyborg.Core;
using Cyborg.Entities;
using Cyborg.Systems;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;
using MonoGame.Extended.Input;
using MonoGame.Extended.Serialization;

namespace Cyborg
{
    public class MainGame : Game
    {
        private readonly IServiceProvider _gameServiceProvider;

        private IWorld _world;
        private SpriteFont _debugFont;

        public MainGame()
        {
            _ = new GraphicsDeviceManager(this)
            {
                PreferredBackBufferWidth = Constants.BaseWidth * Constants.ScaleFactor,
                PreferredBackBufferHeight = Constants.BaseHeight * Constants.ScaleFactor
            };
            Content.RootDirectory = "Content";

            var gameServices = new ServiceCollection();
            ConfigureServices(gameServices);
            _gameServiceProvider = gameServices.BuildServiceProvider();
        }

        protected override void LoadContent()
        {
            _debugFont = _gameServiceProvider.GetRequiredService<ContentManager>().Load<SpriteFont>("debug_font");
            _world = _gameServiceProvider.GetRequiredService<IWorld>();
        }

        protected override void Update(GameTime gameTime)
        {
            Debug.Clear();

            var keyboard = KeyboardExtended.GetState();
            if (keyboard.IsKeyDown(Keys.Escape))
                Exit();

            if (keyboard.WasKeyJustUp(Keys.F1))
                Debug.Toggle();

            _world.Update(gameTime);

            base.Update(gameTime);
        }

        protected override void Draw(GameTime gameTime)
        {
            _world.Draw(gameTime);

            if (Debug.Enabled)
            {
                var spriteBatch = _gameServiceProvider.GetRequiredService<SpriteBatch>();
                spriteBatch.Begin();
                spriteBatch.DrawString(_debugFont, Debug.Output, Vector2.Zero, Color.Black);
                spriteBatch.End();
            }

            base.Draw(gameTime);
        }

        private void ConfigureServices(IServiceCollection services)
        {
            // Framework infrastructure
            services.AddSingleton(_ => GraphicsDevice);
            services.AddSingleton(_ => Content);
            services.AddSingleton<SpriteBatch>();
            services.AddSingleton<JsonContentLoader>();

            // Core infrastructure
            services.AddSingleton<IWorld, World>();
            services.AddSingleton<IEntityManager, IUpdateSystem, EntityManager>();

            // Systems
            services.AddSingleton<IUpdateSystem, PlayerControlSystem>();
            services.AddSingleton<IUpdateSystem, PhysicsSystem>();
            services.AddSingleton<IUpdateSystem, RenderSystem>();
            services.AddSingleton<IDrawSystem, RenderSystem>();

            // Entities
            services.AddSingleton<Player>();
        }
    }
}
