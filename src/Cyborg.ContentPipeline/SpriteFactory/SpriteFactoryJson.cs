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
            public int RegionWidth { get; set; }
            public int RegionHeight { get; set; }
        }

        public class CycleJson
        {
            public int[] Frames { get; set; }
        }
    }
}