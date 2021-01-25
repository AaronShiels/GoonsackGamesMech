using System;
using System.Collections.Generic;

namespace Cyborg.ContentPipeline.Tiled
{
    [Serializable]
    public class MapDefinition
    {
        public short TileWidth { get; set; }
        public short TileHeight { get; set; }
        public IList<LayerDefinition> Layers { get; set; }
        public TileSetDefinition TileSet { get; set; }

        [Serializable]
        public class LayerDefinition
        {
            public string Name { get; set; }
            public short Width { get; set; }
            public short Height { get; set; }
            public short[,] Values { get; set; }
        }

        [Serializable]
        public class TileSetDefinition
        {
            public short TileCount { get; set; }
            public short Columns { get; set; }
            public string Resource { get; set; }
        }
    }
}