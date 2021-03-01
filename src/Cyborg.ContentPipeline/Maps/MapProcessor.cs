using System;
using System.Linq;
using Microsoft.Xna.Framework.Content.Pipeline;

namespace Cyborg.ContentPipeline.Maps
{
    [ContentProcessor(DisplayName = "Map Processor")]
    public class MapProcessor : ContentProcessor<MapXmlRoot, Map>
    {
        public override Map Process(MapXmlRoot input, ContentProcessorContext context)
        {
            var tileSet = new MapTileSet
            {
                SpriteSheet = input.TileSet.Image.Source.Split('.').First(),
                Columns = input.TileSet.Columns,
                TileWidth = input.TileSet.TileWidth,
                TileHeight = input.TileSet.TileHeight
            };

            var tiles = input.Layers
                .ToDictionary(l => l.Name, l =>
                {
                    var values = new int[l.Width, l.Height];

                    var rows = l.Data.Value.Split('\n').Where(s => s.Length > 0).ToArray();
                    for (var y = 0; y < l.Height; y++)
                    {
                        var rowValues = rows[y].Split(',').ToArray();
                        for (var x = 0; x < l.Width; x++)
                        {
                            var value = int.Parse(rowValues[x]);
                            values[x, y] = value;
                        }
                    }

                    return values;
                }, StringComparer.OrdinalIgnoreCase);

            var objects = input.ObjectGroups
                .ToDictionary(og => og.Name, og => og.Objects
                    .Select(o => new MapObject
                    {
                        X = o.X,
                        Y = o.Y,
                        Width = o.Width,
                        Height = o.Height,
                        Type = o.Type
                    })
                    .ToArray(),
                    StringComparer.OrdinalIgnoreCase);

            return new Map
            {
                TileSet = tileSet,
                Tiles = tiles,
                Objects = objects
            };
        }
    }
}