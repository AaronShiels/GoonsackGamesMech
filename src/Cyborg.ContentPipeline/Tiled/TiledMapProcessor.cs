using System;
using System.Linq;
using Microsoft.Xna.Framework.Content.Pipeline;

namespace Cyborg.ContentPipeline.Tiled
{
    [ContentProcessor(DisplayName = "Tiled Map Processor")]
    public class TiledMapProcessor : ContentProcessor<TiledMapXmlRoot, TiledMap>
    {
        private const string _floorKey = "floor";
        private const string _wallsKey = "walls";

        public override TiledMap Process(TiledMapXmlRoot input, ContentProcessorContext context)
        {
            var layers = input
                .Layers
                .Select(l =>
                {
                    var values = new short[l.Width, l.Height];

                    var rows = l.Data.Value.Split('\n').Where(s => s.Length > 0).ToArray();
                    for (var y = 0; y < l.Height; y++)
                    {
                        var rowValues = rows[y].Split(',').ToArray();
                        for (var x = 0; x < l.Width; x++)
                        {
                            var value = short.Parse(rowValues[x]);
                            values[x, y] = value;
                        }
                    }

                    return (l.Name, Values: values);
                })
                .ToDictionary(x => x.Name, x => x.Values, StringComparer.OrdinalIgnoreCase);

            return new TiledMap
            {
                TileSetSpriteSheet = input.TileSet.Image.Source.Split('.').First(),
                TileSetColumns = input.TileSet.Columns,
                TileWidth = input.TileWidth,
                TileHeight = input.TileHeight,
                WallTiles = layers.ContainsKey(_wallsKey) ? layers[_wallsKey] : new short[0, 0],
                FloorTiles = layers.ContainsKey(_floorKey) ? layers[_floorKey] : new short[0, 0],
            };
        }
    }
}