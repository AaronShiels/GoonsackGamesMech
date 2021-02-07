using System.Collections.Generic;
using System.Linq;
using Cyborg.Components;
using Cyborg.ContentPipeline;
using Cyborg.Entities;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;

namespace Cyborg.Core
{
    public class World : IWorld
    {
        private readonly IList<IUpdateSystem> _updateSystems;
        private readonly IList<IDrawSystem> _drawSystems;
        private readonly ICollection<IEntity> _entities;

        public World(ContentManager contentManager, IEnumerable<IUpdateSystem> updateSystems, IEnumerable<IDrawSystem> drawSystems, ICollection<IEntity> entities)
        {
            _updateSystems = updateSystems.ToList();
            _drawSystems = drawSystems.ToList();
            _entities = entities;

            // Load Map
            var worldMap = contentManager.Load<TiledMap>("demo_map");

            var floorTiles = GetFloorTiles(worldMap);
            foreach (var floorTile in floorTiles)
                _entities.Add(floorTile);

            var wallTiles = GetWallTiles(worldMap);
            foreach (var wallTile in wallTiles)
                _entities.Add(wallTile);

            var overlayTiles = GetOverlayTiles(worldMap);
            foreach (var overlayTile in overlayTiles)
                _entities.Add(overlayTile);

            // Create camera
            var initialCameraPosition = new Vector2(160, 88);
            var camera = new Camera(initialCameraPosition, worldMap.Areas.Select(a => new Rectangle(a.X, a.Y, a.Width, a.Height)));
            _entities.Add(camera);

            // Create Player
            var initialPlayerPosition = new Vector2(64, 64);
            var player = new Player(initialPlayerPosition);
            _entities.Add(player);
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

        private static IEnumerable<PassThroughTile> GetFloorTiles(TiledMap worldMap)
        {
            var tiles = worldMap.FloorTiles;
            var tileCountWidth = tiles.GetLength(0);
            var tileCountHeight = tiles.GetLength(1);

            for (var x = 0; x < tileCountWidth; x++)
                for (var y = 0; y < tileCountHeight; y++)
                    if (tiles[x, y] > 0)
                    {
                        var position = new Vector2(x * worldMap.TileWidth, y * worldMap.TileHeight);

                        var tileIndex = tiles[x, y] - 1;
                        var spriteFrameOffsetX = tileIndex % worldMap.TileSetColumns * worldMap.TileWidth;
                        var spriteFrameOffsetY = tileIndex / worldMap.TileSetColumns * worldMap.TileHeight;
                        var spriteFrame = new Rectangle(spriteFrameOffsetX, spriteFrameOffsetY, worldMap.TileWidth, worldMap.TileHeight);

                        yield return new PassThroughTile(position, worldMap.TileSetSpriteSheet, spriteFrame, 0);
                    }
        }

        private static IEnumerable<ObstacleTile> GetWallTiles(TiledMap worldMap)
        {
            var tiles = worldMap.WallTiles;
            var tileCountWidth = tiles.GetLength(0);
            var tileCountHeight = tiles.GetLength(1);

            for (var x = 0; x < tileCountWidth; x++)
                for (var y = 0; y < tileCountHeight; y++)
                    if (tiles[x, y] > 0)
                    {
                        var position = new Vector2(x * worldMap.TileWidth, y * worldMap.TileHeight);
                        var size = new Point(worldMap.TileWidth, worldMap.TileHeight);

                        var edges = Edge.None;
                        if (x > 0 && tiles[x - 1, y] == 0)
                            edges |= Edge.Left;
                        if (x < tileCountWidth - 1 && tiles[x + 1, y] == 0)
                            edges |= Edge.Right;
                        if (y > 0 && tiles[x, y - 1] == 0)
                            edges |= Edge.Top;
                        if (y < tileCountHeight - 1 && tiles[x, y + 1] == 0)
                            edges |= Edge.Bottom;

                        var tileIndex = tiles[x, y] - 1;
                        var spriteFrameOffsetX = tileIndex % worldMap.TileSetColumns * worldMap.TileWidth;
                        var spriteFrameOffsetY = tileIndex / worldMap.TileSetColumns * worldMap.TileHeight;
                        var spriteFrame = new Rectangle(spriteFrameOffsetX, spriteFrameOffsetY, worldMap.TileWidth, worldMap.TileHeight);

                        yield return new ObstacleTile(position, size, edges, worldMap.TileSetSpriteSheet, spriteFrame, 0);
                    }
        }

        private static IEnumerable<PassThroughTile> GetOverlayTiles(TiledMap worldMap)
        {
            var tiles = worldMap.OverlayTiles;
            var tileCountWidth = tiles.GetLength(0);
            var tileCountHeight = tiles.GetLength(1);

            for (var x = 0; x < tileCountWidth; x++)
                for (var y = 0; y < tileCountHeight; y++)
                    if (tiles[x, y] > 0)
                    {
                        var position = new Vector2(x * worldMap.TileWidth, y * worldMap.TileHeight);

                        var tileIndex = tiles[x, y] - 1;
                        var spriteFrameOffsetX = tileIndex % worldMap.TileSetColumns * worldMap.TileWidth;
                        var spriteFrameOffsetY = tileIndex / worldMap.TileSetColumns * worldMap.TileHeight;
                        var spriteFrame = new Rectangle(spriteFrameOffsetX, spriteFrameOffsetY, worldMap.TileWidth, worldMap.TileHeight);

                        yield return new PassThroughTile(position, worldMap.TileSetSpriteSheet, spriteFrame, 2);
                    }
        }
    }
}