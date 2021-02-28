using System.Collections.Generic;
using Cyborg.Components;
using Cyborg.ContentPipeline.Maps;
using Cyborg.Entities;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;

namespace Cyborg.Core
{
    public class World : IWorld
    {
        private readonly IEntityManager _entityManager;
        private readonly IEnumerable<IUpdateSystem> _updateSystems;
        private readonly IEnumerable<IDrawSystem> _drawSystems;

        public World(IEntityManager entityManager, IEnumerable<IUpdateSystem> updateSystems, IEnumerable<IDrawSystem> drawSystems)
        {
            _entityManager = entityManager;
            _updateSystems = updateSystems;
            _drawSystems = drawSystems;

            // Load map
            _entityManager.CreateMany(cm => LoadMap(cm, "demo_map"));

            // load actors
            _entityManager.Create(cm => new CyborgHero(cm, new(160, 88)));
            _entityManager.Create(cm => new Zombie(cm, new(56, 48)));
            _entityManager.Create(cm => new Zombie(cm, new(264, 128)));
            _entityManager.Create(cm => new Zombie(cm, new(160, 168)));
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

        private static IEnumerable<IEntity> LoadMap(ContentManager contentManager, string name)
        {
            var map = contentManager.Load<Map>($"Maps/{name}");
            var spriteSheet = contentManager.Load<Texture2D>($"Maps/{map.TileSetSpriteSheet}");

            // Floor
            for (var x = 0; x < map.FloorTiles.GetLength(0); x++)
                for (var y = 0; y < map.FloorTiles.GetLength(1); y++)
                    if (map.FloorTiles[x, y] > 0)
                    {
                        var position = GetTilePosition(x, y);
                        var size = new Point(map.TileWidth, map.TileHeight);
                        var spriteFrame = GetTileSpriteFrame(map.FloorTiles[x, y]);
                        yield return new Tile(position, size, Edge.None, spriteSheet, spriteFrame, 1);
                    }

            // Walls
            for (var x = 0; x < map.WallTiles.GetLength(0); x++)
                for (var y = 0; y < map.WallTiles.GetLength(1); y++)
                    if (map.WallTiles[x, y] > 0)
                    {
                        var position = GetTilePosition(x, y);
                        var size = new Point(map.TileWidth, map.TileHeight);
                        var edges = Edge.None;
                        if (x > 0 && map.WallTiles[x - 1, y] == 0)
                            edges |= Edge.Left;
                        if (x < map.WallTiles.GetLength(0) - 1 && map.WallTiles[x + 1, y] == 0)
                            edges |= Edge.Right;
                        if (y > 0 && map.WallTiles[x, y - 1] == 0)
                            edges |= Edge.Top;
                        if (y < map.WallTiles.GetLength(1) - 1 && map.WallTiles[x, y + 1] == 0)
                            edges |= Edge.Bottom;
                        var spriteFrame = GetTileSpriteFrame(map.WallTiles[x, y]);
                        yield return new Tile(position, size, edges, spriteSheet, spriteFrame, 2);
                    }

            // Overlay
            for (var x = 0; x < map.OverlayTiles.GetLength(0); x++)
                for (var y = 0; y < map.OverlayTiles.GetLength(1); y++)
                    if (map.OverlayTiles[x, y] > 0)
                    {
                        var position = GetTilePosition(x, y);
                        var size = new Point(map.TileWidth, map.TileHeight);
                        var spriteFrame = GetTileSpriteFrame(map.OverlayTiles[x, y]);
                        yield return new Tile(position, size, Edge.None, spriteSheet, spriteFrame, 5);
                    }

            // Areas
            foreach (var (x, y, width, height) in map.Areas)
                yield return Area.FromMapData(new Rectangle(x, y, width, height));

            Vector2 GetTilePosition(int xIndex, int yIndex) => new(xIndex * map.TileWidth + map.TileWidth / 2, yIndex * map.TileHeight + map.TileHeight / 2);

            Rectangle GetTileSpriteFrame(int value)
            {
                var tileIndex = value - 1;
                var spriteFrameOffsetX = tileIndex % map.TileSetColumns * map.TileWidth;
                var spriteFrameOffsetY = tileIndex / map.TileSetColumns * map.TileHeight;
                return new(spriteFrameOffsetX, spriteFrameOffsetY, map.TileWidth, map.TileHeight);
            }
        }
    }
}