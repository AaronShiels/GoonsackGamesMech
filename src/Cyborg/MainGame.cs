using System;
using System.Collections.Generic;
using Cyborg.Core;
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

        public MainGame()
        {
            _ = new GraphicsDeviceManager(this);

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
            var keyboard = Keyboard.GetState();
            if (keyboard.IsKeyDown(Keys.Escape))
                Exit();

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
            services.AddScoped(svc => new ContentManager(Services, "Content"));
            services.AddScoped<SpriteBatch>();

            // Core infrastructure
            services.AddSingleton<IWorld, World>();
            services.AddScoped<IReadOnlyCollection<IEntity>, ICollection<IEntity>, List<IEntity>>();
            services.AddScoped<IGameState, GameState>();

            // Systems
            services.AddScoped<IUpdateSystem, ControllerSystem>();
            services.AddScoped<IUpdateSystem, PlayerSystem>();
            services.AddScoped<IUpdateSystem, KineticsSystem>();
            services.AddScoped<IUpdateSystem, CollisionSystem>();
            services.AddScoped<IUpdateSystem, AnimationSystem>();
            services.AddScoped<IUpdateSystem, CameraSystem>();
            services.AddScoped<IDrawSystem, SpriteRenderSystem>();
        }
    }
}
