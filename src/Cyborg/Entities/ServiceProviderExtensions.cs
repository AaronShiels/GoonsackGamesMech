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

            var spriteTexture = contentManager.Load<Texture2D>("cyborg_spritesheet");
            var sprite = new SpriteComponent(spriteTexture, default, new(-4, -4), 1);
            var animationSet = contentManager.Load<AnimationSet>("cyborg_animations");
            var animation = AnimationComponent.FromDefinition(animationSet);

            var position = new Vector2(initialX, initialY);
            var size = new Point(8, 12);
            var body = new BodyComponent(position, size, Edge.Left | Edge.Top | Edge.Right | Edge.Bottom);
            var kinetic = new KineticComponent(1);

            return new Player(sprite, animation, body, kinetic);
        }

        public static Camera CreateCamera(this IServiceProvider serviceProvider, int initialX, int initialY)
        {
            var contentManager = serviceProvider.GetRequiredService<ContentManager>();

            var map = contentManager.Load<TiledMap>("demo_map");
            var areas = map.Areas.Select(a => new Rectangle(a.X, a.Y, a.Width, a.Height));

            var position = new Vector2(initialX, initialY);
            var body = new BodyComponent(position);

            return new Camera(body, areas);
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
                        var tileIndex = tiles[x, y] - 1;
                        var spriteFrameOffsetX = tileIndex % map.TileSetColumns * map.TileWidth;
                        var spriteFrameOffsetY = tileIndex / map.TileSetColumns * map.TileHeight;
                        var spriteFrame = new Rectangle(spriteFrameOffsetX, spriteFrameOffsetY, map.TileWidth, map.TileHeight);
                        var spriteComponent = new SpriteComponent(spriteSheet, spriteFrame);

                        var position = new Vector2(x * map.TileWidth, y * map.TileHeight);
                        var body = new BodyComponent(position);

                        yield return new PassThroughTile(spriteComponent, body);
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

                        var tileIndex = tiles[x, y] - 1;
                        var spriteFrameOffsetX = tileIndex % map.TileSetColumns * map.TileWidth;
                        var spriteFrameOffsetY = tileIndex / map.TileSetColumns * map.TileHeight;
                        var spriteFrame = new Rectangle(spriteFrameOffsetX, spriteFrameOffsetY, map.TileWidth, map.TileHeight);
                        var spriteComponent = new SpriteComponent(spriteSheet, spriteFrame);

                        var edges = Edge.None;
                        if (x > 0 && tiles[x - 1, y] == 0)
                            edges |= Edge.Left;
                        if (x < tileCountWidth - 1 && tiles[x + 1, y] == 0)
                            edges |= Edge.Right;
                        if (y > 0 && tiles[x, y - 1] == 0)
                            edges |= Edge.Top;
                        if (y < tileCountHeight - 1 && tiles[x, y + 1] == 0)
                            edges |= Edge.Bottom;

                        var position = new Vector2(x * map.TileWidth, y * map.TileHeight);
                        var size = new Point(map.TileWidth, map.TileHeight);
                        var body = new BodyComponent(position, size, edges);

                        yield return new ObstacleTile(spriteComponent, body);
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
                        var tileIndex = tiles[x, y] - 1;
                        var spriteFrameOffsetX = tileIndex % map.TileSetColumns * map.TileWidth;
                        var spriteFrameOffsetY = tileIndex / map.TileSetColumns * map.TileHeight;
                        var spriteFrame = new Rectangle(spriteFrameOffsetX, spriteFrameOffsetY, map.TileWidth, map.TileHeight);
                        var spriteComponent = new SpriteComponent(spriteSheet, spriteFrame, default, 2);

                        var position = new Vector2(x * map.TileWidth, y * map.TileHeight);
                        var body = new BodyComponent(position);

                        yield return new PassThroughTile(spriteComponent, body);
                    }
        }
    }
}