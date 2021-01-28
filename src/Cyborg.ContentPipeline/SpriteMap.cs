using System;

namespace Cyborg.ContentPipeline
{
    [Serializable]
    public class SpriteMap
    {
        public string SpriteSheet { get; set; }
        public short TileWidth { get; set; }
        public short TileHeight { get; set; }
        public short[,] BackgroundMap { get; set; }
        public short[,] CollisionMap { get; set; }
    }
}