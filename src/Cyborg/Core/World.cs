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

            // Load
            var floorTiles = serviceProvider.CreateFloorTiles();
            var wallTiles = serviceProvider.GetWallTiles();
            var overlayTiles = serviceProvider.CreateOverlayTiles();
            var player = serviceProvider.CreatePlayer(64, 64);
            var camera = serviceProvider.CreateCamera(160, 88);

            floorTiles.ForEach(_entities.Add);
            wallTiles.ForEach(_entities.Add);
            overlayTiles.ForEach(_entities.Add);
            _entities.Add(player);
            _entities.Add(camera);
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