using System;
using System.Collections.Generic;
using Cyborg.Core;
using Cyborg.Utilities;
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
        private readonly GraphicsDeviceManager _graphicsDeviceManager;
        private readonly IServiceProvider _gameServiceProvider;

        private IWorld _world;

        public MainGame()
        {
            _graphicsDeviceManager = new GraphicsDeviceManager(this);

            var gameServices = new ServiceCollection();
            ConfigureServices(gameServices);
            _gameServiceProvider = gameServices.BuildServiceProvider();
        }

        protected override void Initialize()
        {
            _graphicsDeviceManager.PreferredBackBufferWidth = 960;
            _graphicsDeviceManager.PreferredBackBufferHeight = 528;
            _graphicsDeviceManager.ApplyChanges();

            base.Initialize();
        }

        protected override void LoadContent()
        {
            _world = _gameServiceProvider.GetRequiredService<IWorld>();
            _world.Load();
        }

        protected override void Update(GameTime gameTime)
        {
            var keyboard = Keyboard.GetState();
            if (keyboard.IsKeyDown(Keys.Escape))
                Exit();

            _world.Update(gameTime);

            base.Update(gameTime);
        }

        protected override void Draw(GameTime gameTime)
        {
            GraphicsDevice.Clear(new Color(57, 49, 75));

            _world.Draw(gameTime);

            base.Draw(gameTime);
        }

        private void ConfigureServices(IServiceCollection services)
        {
            // Framework infrastructure
            services.AddSingleton(_ => GraphicsDevice);
            services.AddScoped(svc => new ContentManager(Services, "Content"));

            // Core infrastructure
            services.AddScoped<IWorld, World>();
            services.AddScoped<IList<IArea>, List<IArea>>();
            services.AddScoped<ICamera, Camera>();
            services.AddScoped<IEntityManager, IUpdateSystem, EntityManager>();
            services.AddScoped<IGameState, GameState, GameState>();

            // Systems
            services.AddScoped<IUpdateSystem, ControllerSystem>();
            services.AddScoped<IUpdateSystem, PlayerSystem>();
            services.AddScoped<IUpdateSystem, EnemySystem>();
            services.AddScoped<IUpdateSystem, DamageSystem>();
            services.AddScoped<IUpdateSystem, KineticsSystem>();
            services.AddScoped<IUpdateSystem, CollisionSystem>();
            services.AddScoped<IUpdateSystem, AreaSystem>();
            services.AddScoped<IUpdateSystem, ParticleSystem>();
            services.AddScoped<IUpdateSystem, IDrawSystem, SpriteSystem>();
            services.AddScoped<IUpdateSystem, IDrawSystem, DebugSystem>();
        }
    }
}
