using System;
using System.Collections.Generic;
using System.Linq;
using Cyborg.Entities;
using Cyborg.Utilities;
using Microsoft.Xna.Framework;

namespace Cyborg.Core
{
    public class World : IWorld
    {
        private readonly IList<IUpdateSystem> _updateSystems;
        private readonly IList<IDrawSystem> _drawSystems;
        private readonly ICollection<IEntity> _entities;

        public World(IServiceProvider serviceProvider, IEnumerable<IUpdateSystem> updateSystems, IEnumerable<IDrawSystem> drawSystems, ICollection<IEntity> entities)
        {
            _updateSystems = updateSystems.ToList();
            _drawSystems = drawSystems.ToList();
            _entities = entities;

            // Load map
            serviceProvider.CreateFloorTiles().ForEach(_entities.Add);
            serviceProvider.GetWallTiles().ForEach(_entities.Add);
            serviceProvider.CreateOverlayTiles().ForEach(_entities.Add);
            serviceProvider.CreateAreas().ForEach(_entities.Add);

            // load actors
            _entities.Add(serviceProvider.CreatePlayer(160, 88));
            _entities.Add(serviceProvider.CreateEnemy(56, 48));
            _entities.Add(serviceProvider.CreateEnemy(264, 128));
            _entities.Add(serviceProvider.CreateEnemy(160, 168));
        }

        public void Update(GameTime gameTime)
        {
            foreach (var system in _updateSystems)
                system.Update(gameTime);

            var destroyedEntites = _entities.Where(e => e.Destroyed).ToList();
            foreach (var destroyedEntity in destroyedEntites)
                _entities.Remove(destroyedEntity);
        }

        public void Draw(GameTime gameTime)
        {
            foreach (var system in _drawSystems)
                system.Draw(gameTime);
        }
    }
}