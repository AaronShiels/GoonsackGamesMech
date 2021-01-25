using System.Linq;
using Microsoft.Xna.Framework.Content.Pipeline;

namespace Cyborg.ContentPipeline.Tiled
{
    [ContentProcessor(DisplayName = "TMX Processor")]
    public class MapProcessor : ContentProcessor<MapXmlRoot, MapDefinition>
    {
        public override MapDefinition Process(MapXmlRoot input, ContentProcessorContext context)
        {
            var layers = input.Layers
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

                    return new MapDefinition.LayerDefinition
                    {
                        Name = l.Name,
                        Width = l.Width,
                        Height = l.Height,
                        Values = values
                    };
                })
                .ToList();

            var tileSet = new MapDefinition.TileSetDefinition
            {
                TileCount = input.TileSet.TileCount,
                Columns = input.TileSet.Columns,
                Resource = input.TileSet.Image.Source.Split('.').First()
            };

            return new MapDefinition
            {
                TileWidth = input.TileWidth,
                TileHeight = input.TileHeight,
                Layers = layers,
                TileSet = tileSet
            };
        }
    }
}