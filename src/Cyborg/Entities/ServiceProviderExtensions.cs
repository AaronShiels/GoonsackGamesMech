using System;
using System.Collections.Generic;
using System.Linq;
using Cyborg.Components;
using Cyborg.ContentPipeline.Animations;
using Cyborg.ContentPipeline.Maps;
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

            var animationRoot = "Cyborg/";
            var animationSet = contentManager.Load<AnimationSet>($"{animationRoot}animations");
            var animations = animationSet.ToDictionary(kvp => kvp.Key, kvp =>
            {
                var texture = contentManager.Load<Texture2D>($"{animationRoot}{kvp.Key}");
                return (texture, kvp.Value.FrameCount, kvp.Value.FrameRate, kvp.Value.Repeat);
            });
            var sprite = new AnimatedSpriteComponent(animations, new(0, -2), 3);

            var position = new Vector2(initialX, initialY);
            var size = new Point(8, 12);
            var body = new BodyComponent(position, size, Edge.Left | Edge.Top | Edge.Right | Edge.Bottom);
            var kinetic = new KineticComponent(1);

            return new Player(sprite, body, kinetic);
        }

        public static Enemy CreateEnemy(this IServiceProvider serviceProvider, int initialX, int initialY)
        {
            var graphicsDevice = serviceProvider.GetRequiredService<GraphicsDevice>();

            var spriteTexture = new Texture2D(graphicsDevice, 16, 16);
            var colourArray = Enumerable.Range(0, 16 * 16).Select(_ => Color.Maroon).ToArray();
            spriteTexture.SetData(colourArray);
            var sprite = new StaticSpriteComponent(spriteTexture, null, default, 2);

            var position = new Vector2(initialX, initialY);
            var size = new Point(16, 16);
            var body = new BodyComponent(position, size, Edge.Left | Edge.Top | Edge.Right | Edge.Bottom);
            var kinetic = new KineticComponent(1);

            var damage = new DamageComponent(10, 0.25f);

            return new Enemy(kinetic, damage, body, sprite);
        }

        public static IEnumerable<Area> CreateAreas(this IServiceProvider serviceProvider)
        {
            var contentManager = serviceProvider.GetRequiredService<ContentManager>();

            var mapRoot = "Maps/";
            var map = contentManager.Load<Map>($"{mapRoot}demo_map");
            return map.Areas
                .Select(a => new Area(new Rectangle(a.X, a.Y, a.Width, a.Height)));
        }

        public static IEnumerable<PassThroughTile> CreateFloorTiles(this IServiceProvider serviceProvider)
        {
            var contentManager = serviceProvider.GetRequiredService<ContentManager>();

            var mapRoot = "Maps/";
            var map = contentManager.Load<Map>($"{mapRoot}demo_map");
            var tiles = map.FloorTiles;
            var tileCountWidth = tiles.GetLength(0);
            var tileCountHeight = tiles.GetLength(1);
            var spriteSheet = contentManager.Load<Texture2D>($"{mapRoot}{map.TileSetSpriteSheet}");

            for (var x = 0; x < tileCountWidth; x++)
                for (var y = 0; y < tileCountHeight; y++)
                    if (tiles[x, y] > 0)
                    {
                        var tileIndex = tiles[x, y] - 1;
                        var spriteFrameOffsetX = tileIndex % map.TileSetColumns * map.TileWidth;
                        var spriteFrameOffsetY = tileIndex / map.TileSetColumns * map.TileHeight;
                        var spriteFrame = new Rectangle(spriteFrameOffsetX, spriteFrameOffsetY, map.TileWidth, map.TileHeight);
                        var sprite = new StaticSpriteComponent(spriteSheet, spriteFrame);

                        var position = new Vector2(x * map.TileWidth + map.TileWidth / 2, y * map.TileHeight + map.TileHeight / 2);
                        var body = new BodyComponent(position);

                        yield return new PassThroughTile(sprite, body);
                    }
        }

        public static IEnumerable<ObstacleTile> GetWallTiles(this IServiceProvider serviceProvider)
        {
            var contentManager = serviceProvider.GetRequiredService<ContentManager>();

            var mapRoot = "Maps/";
            var map = contentManager.Load<Map>($"{mapRoot}demo_map");
            var tiles = map.WallTiles;
            var tileCountWidth = tiles.GetLength(0);
            var tileCountHeight = tiles.GetLength(1);
            var spriteSheet = contentManager.Load<Texture2D>($"{mapRoot}{map.TileSetSpriteSheet}");

            for (var x = 0; x < tileCountWidth; x++)
                for (var y = 0; y < tileCountHeight; y++)
                    if (tiles[x, y] > 0)
                    {

                        var tileIndex = tiles[x, y] - 1;
                        var spriteFrameOffsetX = tileIndex % map.TileSetColumns * map.TileWidth;
                        var spriteFrameOffsetY = tileIndex / map.TileSetColumns * map.TileHeight;
                        var spriteFrame = new Rectangle(spriteFrameOffsetX, spriteFrameOffsetY, map.TileWidth, map.TileHeight);
                        var sprite = new StaticSpriteComponent(spriteSheet, spriteFrame);

                        var edges = Edge.None;
                        if (x > 0 && tiles[x - 1, y] == 0)
                            edges |= Edge.Left;
                        if (x < tileCountWidth - 1 && tiles[x + 1, y] == 0)
                            edges |= Edge.Right;
                        if (y > 0 && tiles[x, y - 1] == 0)
                            edges |= Edge.Top;
                        if (y < tileCountHeight - 1 && tiles[x, y + 1] == 0)
                            edges |= Edge.Bottom;

                        var position = new Vector2(x * map.TileWidth + map.TileWidth / 2, y * map.TileHeight + map.TileHeight / 2);
                        var size = new Point(map.TileWidth, map.TileHeight);
                        var body = new BodyComponent(position, size, edges);

                        yield return new ObstacleTile(sprite, body);
                    }
        }

        public static IEnumerable<PassThroughTile> CreateOverlayTiles(this IServiceProvider serviceProvider)
        {
            var contentManager = serviceProvider.GetRequiredService<ContentManager>();

            var mapRoot = "Maps/";
            var map = contentManager.Load<Map>($"{mapRoot}demo_map");
            var tiles = map.OverlayTiles;
            var tileCountWidth = tiles.GetLength(0);
            var tileCountHeight = tiles.GetLength(1);
            var spriteSheet = contentManager.Load<Texture2D>($"{mapRoot}{map.TileSetSpriteSheet}");

            for (var x = 0; x < tileCountWidth; x++)
                for (var y = 0; y < tileCountHeight; y++)
                    if (tiles[x, y] > 0)
                    {
                        var tileIndex = tiles[x, y] - 1;
                        var spriteFrameOffsetX = tileIndex % map.TileSetColumns * map.TileWidth;
                        var spriteFrameOffsetY = tileIndex / map.TileSetColumns * map.TileHeight;
                        var spriteFrame = new Rectangle(spriteFrameOffsetX, spriteFrameOffsetY, map.TileWidth, map.TileHeight);
                        var sprite = new StaticSpriteComponent(spriteSheet, spriteFrame, default, 4);

                        var position = new Vector2(x * map.TileWidth + map.TileWidth / 2, y * map.TileHeight + map.TileHeight / 2);
                        var body = new BodyComponent(position);

                        yield return new PassThroughTile(sprite, body);
                    }
        }
    }
}