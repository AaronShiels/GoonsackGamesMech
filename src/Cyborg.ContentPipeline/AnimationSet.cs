using System;
using System.Collections.Generic;

namespace Cyborg.ContentPipeline
{
    [Serializable]
    public class AnimationSet
    {
        public string SpriteSheet { get; set; }
        public int FrameWidth { get; set; }
        public int FrameHeight { get; set; }
        public IDictionary<string, int[]> Animations { get; set; }
    }
}