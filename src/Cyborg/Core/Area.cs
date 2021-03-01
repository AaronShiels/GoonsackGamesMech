using System;
using System.Collections.Generic;
using System.Linq;
using Cyborg.Components;
using Cyborg.ContentPipeline.Maps;
using Cyborg.Entities;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;

namespace Cyborg.Core
{
    public class Area : IArea
    {
        private readonly IEntityManager _entityManager;
        private readonly string _mapName;

        private IEnumerable<IEntity> _loadedEntites = null;

        public Area(IEntityManager entityManager, string mapName, Rectangle areaBounds)
        {
            _entityManager = entityManager;
            _mapName = mapName;

            Bounds = areaBounds;
        }

        public Rectangle Bounds { get; }

        public void Load()
        {
            if (_loadedEntites != null)
                return;

            _loadedEntites = _entityManager.CreateMany(cm => CreateAreaEntities(cm));
        }

        public void Unload()
        {
            if (_loadedEntites == null)
                return;

            foreach (var entity in _loadedEntites)
                entity.Destroyed = true;

            _loadedEntites = null;
        }

        private IEnumerable<IEntity> CreateAreaEntities(ContentManager contentManager)
        {
            var map = contentManager.Load<Map>($"Maps/{_mapName}");
            var spriteSheet = contentManager.Load<Texture2D>($"Maps/{map.TileSet.SpriteSheet}");

            // Passthrough Underlay
            var passThroughUnderlay = map.Tiles["floor"];
            for (var x = 0; x < passThroughUnderlay.GetLength(0); x++)
                for (var y = 0; y < passThroughUnderlay.GetLength(1); y++)
                    if (passThroughUnderlay[x, y] > 0)
                    {
                        var tileBounds = GetTileBounds(x, y);
                        if (!tileBounds.Intersects(Bounds))
                            continue;

                        var spriteFrame = GetTileSpriteFrame(passThroughUnderlay[x, y]);
                        yield return new Tile(tileBounds.Center.ToVector2(), tileBounds.Size, Edge.None, spriteSheet, spriteFrame, 1);
                    }

            // Obstacle Underlay
            var obstacleUnderlay = map.Tiles["walls"];
            for (var x = 0; x < obstacleUnderlay.GetLength(0); x++)
                for (var y = 0; y < obstacleUnderlay.GetLength(1); y++)
                    if (obstacleUnderlay[x, y] > 0)
                    {
                        var tileBounds = GetTileBounds(x, y);
                        if (!tileBounds.Intersects(Bounds))
                            continue;

                        var edges = Edge.None;
                        if (x > 0 && obstacleUnderlay[x - 1, y] == 0)
                            edges |= Edge.Left;
                        if (x < obstacleUnderlay.GetLength(0) - 1 && obstacleUnderlay[x + 1, y] == 0)
                            edges |= Edge.Right;
                        if (y > 0 && obstacleUnderlay[x, y - 1] == 0)
                            edges |= Edge.Top;
                        if (y < obstacleUnderlay.GetLength(1) - 1 && obstacleUnderlay[x, y + 1] == 0)
                            edges |= Edge.Bottom;
                        var spriteFrame = GetTileSpriteFrame(obstacleUnderlay[x, y]);
                        yield return new Tile(tileBounds.Center.ToVector2(), tileBounds.Size, edges, spriteSheet, spriteFrame, 2);
                    }

            // Passthrough Overlay
            var passthroughOverlay = map.Tiles["overlay"];
            for (var x = 0; x < passthroughOverlay.GetLength(0); x++)
                for (var y = 0; y < passthroughOverlay.GetLength(1); y++)
                    if (passthroughOverlay[x, y] > 0)
                    {
                        var tileBounds = GetTileBounds(x, y);
                        if (!tileBounds.Intersects(Bounds))
                            continue;

                        var spriteFrame = GetTileSpriteFrame(passthroughOverlay[x, y]);
                        yield return new Tile(tileBounds.Center.ToVector2(), tileBounds.Size, Edge.None, spriteSheet, spriteFrame, 5);
                    }

            // Enemies
            foreach (var enemy in map.Objects["enemies"])
            {
                var enemyBounds = new Rectangle(enemy.X, enemy.Y, enemy.Width, enemy.Height);
                if (!enemyBounds.Intersects(Bounds))
                    continue;

                if (enemy.Type == "Zombie")
                    yield return new Zombie(contentManager, enemyBounds.Center.ToVector2());
            }

            Rectangle GetTileBounds(int xIndex, int yIndex) => new(xIndex * map.TileSet.TileWidth, yIndex * map.TileSet.TileHeight, map.TileSet.TileWidth, map.TileSet.TileHeight);

            Rectangle GetTileSpriteFrame(int value)
            {
                var tileIndex = value - 1;
                var spriteFrameOffsetX = tileIndex % map.TileSet.Columns * map.TileSet.TileWidth;
                var spriteFrameOffsetY = tileIndex / map.TileSet.Columns * map.TileSet.TileHeight;
                return new(spriteFrameOffsetX, spriteFrameOffsetY, map.TileSet.TileWidth, map.TileSet.TileHeight);
            }
        }
    }
}