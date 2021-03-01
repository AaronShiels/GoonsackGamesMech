using System.Collections.Generic;
using System.Linq;
using Cyborg.ContentPipeline.Maps;
using Cyborg.Entities;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;

namespace Cyborg.Core
{
    public class World : IWorld
    {
        private readonly ContentManager _contentManager;
        private readonly IEntityManager _entityManager;
        private readonly IEnumerable<IUpdateSystem> _updateSystems;
        private readonly IEnumerable<IDrawSystem> _drawSystems;
        private readonly IList<IArea> _areas;

        public World(ContentManager contentManager, IEntityManager entityManager, IEnumerable<IUpdateSystem> updateSystems, IEnumerable<IDrawSystem> drawSystems, IList<IArea> areas)
        {
            _contentManager = contentManager;
            _entityManager = entityManager;
            _updateSystems = updateSystems;
            _drawSystems = drawSystems;
            _areas = areas;
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

        public void Load()
        {
            var mapName = "demo_map";
            var map = _contentManager.Load<Map>($"Maps/{mapName}");
            var areas = map.Objects["areas"]
                .Select(a => new Rectangle(a.X, a.Y, a.Width, a.Height))
                .Select(b => new Area(_entityManager, mapName, b))
                .ToList();

            foreach (var area in areas)
                _areas.Add(area);

            _entityManager.Create(cm => new CyborgHero(cm, new(160, 88)));
        }

        public void Unload()
        {
            var areasToUnload = _areas.ToList();
            foreach (var area in areasToUnload)
            {
                area.Unload();
                _areas.Remove(area);
            }
        }
    }
}