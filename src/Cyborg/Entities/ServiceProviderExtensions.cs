using System;
using System.Collections.Generic;
using System.Linq;
using Cyborg.Components;
using Cyborg.ContentPipeline;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;

namespace Cyborg.Entities
{
    public static class ServiceProviderExtensions
    {
        public static Player CreatePlayer(this IServiceProvider serviceProvider, int initialX, int initialY)
        {
            var contentManager = serviceProvider.GetRequiredService<ContentManager>();

            var position = new Vector2(initialX, initialY);
            var spriteTexture = contentManager.Load<Texture2D>("cyborg_spritesheet");
            var spriteComponent = new SpriteComponent(spriteTexture, default, new(-4, -4), 1);
            var animationSet = contentManager.Load<AnimationSet>("cyborg_animations");
            var animationComponent = AnimationComponent.FromDefinition(animationSet);
            return new Player(spriteComponent, animationComponent, position);
        }

        public static Camera CreateCamera(this IServiceProvider serviceProvider, int initialX, int initialY)
        {
            var contentManager = serviceProvider.GetRequiredService<ContentManager>();

            var position = new Vector2(initialX, initialY);
            var map = contentManager.Load<TiledMap>("demo_map");
            var areas = map.Areas.Select(a => new Rectangle(a.X, a.Y, a.Width, a.Height));
            return new Camera(position, areas);
        }

        public static IEnumerable<PassThroughTile> CreateFloorTiles(this IServiceProvider serviceProvider)
        {
            var contentManager = serviceProvider.GetRequiredService<ContentManager>();

            var map = contentManager.Load<TiledMap>("demo_map");
            var tiles = map.FloorTiles;
            var tileCountWidth = tiles.GetLength(0);
            var tileCountHeight = tiles.GetLength(1);
            var spriteSheet = contentManager.Load<Texture2D>(map.TileSetSpriteSheet);

            for (var x = 0; x < tileCountWidth; x++)
                for (var y = 0; y < tileCountHeight; y++)
                    if (tiles[x, y] > 0)
                    {
                        var position = new Vector2(x * map.TileWidth, y * map.TileHeight);

                        var tileIndex = tiles[x, y] - 1;
                        var spriteFrameOffsetX = tileIndex % map.TileSetColumns * map.TileWidth;
                        var spriteFrameOffsetY = tileIndex / map.TileSetColumns * map.TileHeight;
                        var spriteFrame = new Rectangle(spriteFrameOffsetX, spriteFrameOffsetY, map.TileWidth, map.TileHeight);
                        var spriteComponent = new SpriteComponent(spriteSheet, spriteFrame);

                        yield return new PassThroughTile(spriteComponent, position);
                    }
        }

        public static IEnumerable<ObstacleTile> GetWallTiles(this IServiceProvider serviceProvider)
        {
            var contentManager = serviceProvider.GetRequiredService<ContentManager>();

            var map = contentManager.Load<TiledMap>("demo_map");
            var tiles = map.WallTiles;
            var tileCountWidth = tiles.GetLength(0);
            var tileCountHeight = tiles.GetLength(1);
            var spriteSheet = contentManager.Load<Texture2D>(map.TileSetSpriteSheet);

            for (var x = 0; x < tileCountWidth; x++)
                for (var y = 0; y < tileCountHeight; y++)
                    if (tiles[x, y] > 0)
                    {
                        var position = new Vector2(x * map.TileWidth, y * map.TileHeight);
                        var size = new Point(map.TileWidth, map.TileHeight);

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
                        var spriteFrameOffsetX = tileIndex % map.TileSetColumns * map.TileWidth;
                        var spriteFrameOffsetY = tileIndex / map.TileSetColumns * map.TileHeight;
                        var spriteFrame = new Rectangle(spriteFrameOffsetX, spriteFrameOffsetY, map.TileWidth, map.TileHeight);
                        var spriteComponent = new SpriteComponent(spriteSheet, spriteFrame);

                        yield return new ObstacleTile(spriteComponent, position, size, edges);
                    }
        }

        public static IEnumerable<PassThroughTile> CreateOverlayTiles(this IServiceProvider serviceProvider)
        {
            var contentManager = serviceProvider.GetRequiredService<ContentManager>();

            var map = contentManager.Load<TiledMap>("demo_map");
            var tiles = map.OverlayTiles;
            var tileCountWidth = tiles.GetLength(0);
            var tileCountHeight = tiles.GetLength(1);
            var spriteSheet = contentManager.Load<Texture2D>(map.TileSetSpriteSheet);

            for (var x = 0; x < tileCountWidth; x++)
                for (var y = 0; y < tileCountHeight; y++)
                    if (tiles[x, y] > 0)
                    {
                        var position = new Vector2(x * map.TileWidth, y * map.TileHeight);

                        var tileIndex = tiles[x, y] - 1;
                        var spriteFrameOffsetX = tileIndex % map.TileSetColumns * map.TileWidth;
                        var spriteFrameOffsetY = tileIndex / map.TileSetColumns * map.TileHeight;
                        var spriteFrame = new Rectangle(spriteFrameOffsetX, spriteFrameOffsetY, map.TileWidth, map.TileHeight);
                        var spriteComponent = new SpriteComponent(spriteSheet, spriteFrame, default, 2);

                        yield return new PassThroughTile(spriteComponent, position);
                    }
        }
    }
}