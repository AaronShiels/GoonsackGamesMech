using System.Collections.Generic;

namespace Cyborg.ContentPipeline.SpriteFactory
{
    public class SpriteFactoryJson
    {
        public TextureAtlasJson TextureAtlas { get; set; }
        public Dictionary<string, CycleJson> Cycles { get; set; }

        public class TextureAtlasJson
        {
            public string Texture { get; set; }
            public short RegionWidth { get; set; }
            public short RegionHeight { get; set; }
        }

        public class CycleJson
        {
            public short[] Frames { get; set; }
        }
    }
}