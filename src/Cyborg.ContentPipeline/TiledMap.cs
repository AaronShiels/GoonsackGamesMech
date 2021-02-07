using System;

namespace Cyborg.ContentPipeline
{
    [Serializable]
    public class TiledMap
    {
        public string TileSetSpriteSheet { get; set; }
        public short TileSetColumns { get; set; }
        public short TileWidth { get; set; }
        public short TileHeight { get; set; }
        public short[,] FloorTiles { get; set; }
        public short[,] WallTiles { get; set; }
        public short[,] OverlayTiles { get; set; }
        public (int X, int Y, int Width, int Height)[] Areas { get; set; }
    }
}