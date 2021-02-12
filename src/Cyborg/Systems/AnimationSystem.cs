using System.Collections.Generic;
using System.Linq;
using Cyborg.Components;
using Cyborg.ContentPipeline;
using Cyborg.Core;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;

namespace Cyborg.Systems
{
    public class AnimationSystem : IUpdateSystem
    {
        private readonly IReadOnlyCollection<IEntity> _entities;
        private readonly IGameState _gameState;

        public AnimationSystem(IReadOnlyCollection<IEntity> entities, IGameState gameState)
        {
            _entities = entities;
            _gameState = gameState;
        }

        public void Update(GameTime gameTime)
        {
            if (!_gameState.Active)
                return;

            var elapsed = (float)gameTime.ElapsedGameTime.TotalSeconds;

            var animatedEntities = _entities.OfType<IAnimated>();
            foreach (var entity in animatedEntities)
            {
                entity.Animation.Update(elapsed);
                entity.Sprite.Update(entity.Animation.Frame);
            }
        }
    }
}