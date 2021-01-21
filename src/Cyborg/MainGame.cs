using System;
using Cyborg.Core;
using Cyborg.Entities;
using Cyborg.Systems;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace Cyborg
{
    public class MainGame : Game
    {
        private readonly IServiceProvider _gameServiceProvider;

        private IWorld _world;

        public MainGame()
        {
            _ = new GraphicsDeviceManager(this)
            {
                //PreferredBackBufferWidth = 320,
                //PreferredBackBufferHeight = 180
            };
            Content.RootDirectory = "Content";

            var gameServices = new ServiceCollection();
            ConfigureServices(gameServices);
            _gameServiceProvider = gameServices.BuildServiceProvider();
        }

        protected override void LoadContent()
        {
            _world = _gameServiceProvider.GetRequiredService<IWorld>();
        }

        protected override void Update(GameTime gameTime)
        {
            _world.Update(gameTime);

            base.Update(gameTime);
        }

        protected override void Draw(GameTime gameTime)
        {
            _world.Draw(gameTime);

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
            services.AddSingleton<IUpdateSystem, PlayerControlSystem>();
            services.AddSingleton<IDrawSystem, RenderSystem>();

            // Entities
            services.AddEntity<Player>();
        }
    }
}
