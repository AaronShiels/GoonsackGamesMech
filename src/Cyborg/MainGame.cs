using System;
using Cyborg.Core;
using Cyborg.Entities;
using Cyborg.Systems;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;

namespace Cyborg
{
    public class MainGame : Game
    {
        private readonly IServiceProvider _gameServiceProvider;

        private IWorld _world;
        private SpriteFont _debugFont;

        public MainGame()
        {
            _ = new GraphicsDeviceManager(this);
            Content.RootDirectory = "Content";

            var gameServices = new ServiceCollection();
            ConfigureServices(gameServices);
            _gameServiceProvider = gameServices.BuildServiceProvider();

#if DEBUG
            Debug.Enabled = true;
#endif
        }

        protected override void LoadContent()
        {
            var contentManager = _gameServiceProvider.GetRequiredService<ContentManager>();

            _debugFont = contentManager.Load<SpriteFont>("debug_font");
            _world = _gameServiceProvider.GetRequiredService<IWorld>();
        }

        protected override void Update(GameTime gameTime)
        {
            Debug.Clear();

            var keyboard = Keyboard.GetState();
            if (keyboard.IsKeyDown(Keys.Escape))
                Exit();

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

            // Core infrastructure
            services.AddSingleton<IWorld, World>();
            services.AddSingleton<IEntityManager, IUpdateSystem, EntityManager>();

            // Systems
            services.AddSingleton<IUpdateSystem, ControllerSystem>();
            services.AddSingleton<IUpdateSystem, PlayerSystem>();
            services.AddSingleton<IUpdateSystem, KineticsSystem>();
            services.AddSingleton<IUpdateSystem, CollisionSystem>();
            services.AddSingleton<IUpdateSystem, IDrawSystem, SpriteRenderSystem>();

            // Entities
            services.AddSingleton<Player>();
            services.AddTransient<Area>();
        }
    }
}
