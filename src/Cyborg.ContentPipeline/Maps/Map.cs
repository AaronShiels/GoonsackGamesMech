using System;
using System.Collections.Generic;

namespace Cyborg.ContentPipeline.Maps
{
    [Serializable]
    public class Map
    {
        public MapTileSet TileSet { get; set; }
        public Dictionary<string, int[,]> Tiles { get; set; }
        public Dictionary<string, MapObject[]> Objects { get; set; }
    }

    [Serializable]
    public struct MapTileSet
    {
        public string SpriteSheet { get; set; }
        public int TileWidth { get; set; }
        public int TileHeight { get; set; }
        public int Columns { get; set; }
    }

    [Serializable]
    public struct MapObject
    {
        public string Type { get; set; }
        public int X { get; set; }
        public int Y { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
    }
}