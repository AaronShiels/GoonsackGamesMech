using System;
using System.Collections.Generic;
using System.Linq;
using Cyborg.Entities;
using Microsoft.Xna.Framework;

namespace Cyborg.Core
{
    public class World : IWorld
    {
        private readonly IList<IUpdateSystem> _updateSystems;
        private readonly IList<IDrawSystem> _drawSystems;

        public World(IEnumerable<IUpdateSystem> updateSystems, IEnumerable<IDrawSystem> drawSystems, IEntityManager entityManager)
        {
            _updateSystems = updateSystems.ToList();
            _drawSystems = drawSystems.ToList();

            var player = entityManager.Create<Player>();
            player.Position = new Vector2(160, 90);
        }

        public void Update(GameTime gameTime)
        {
            foreach (var system in _updateSystems)
                system.Update(gameTime);
        }

        public void Draw(GameTime gameTime)
        {
            foreach (var system in _drawSystems)
                system.Draw(gameTime);
        }
    }
}