using System;
using System.Linq;
using Microsoft.Xna.Framework.Content.Pipeline;

namespace Cyborg.ContentPipeline.Tiled
{
    [ContentProcessor(DisplayName = "Tiled Map Processor")]
    public class TiledMapProcessor : ContentProcessor<TiledMapXmlRoot, SpriteMap>
    {
        private const string _backgroundKey = "background";

        public override SpriteMap Process(TiledMapXmlRoot input, ContentProcessorContext context)
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

            return new SpriteMap
            {
                SpriteSheet = input.TileSet.Image.Source.Split('.').First(),
                Width = input.Width,
                Height = input.Height,
                TileWidth = input.TileWidth,
                TileHeight = input.TileHeight,
                BackgroundMap = layers.ContainsKey(_backgroundKey) ? layers[_backgroundKey] : null
            };
        }
    }
}