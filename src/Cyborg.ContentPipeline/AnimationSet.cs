using System;
using System.Collections.Generic;

namespace Cyborg.ContentPipeline
{
    [Serializable]
    public class AnimationSet
    {
        public short FrameWidth { get; set; }
        public short FrameHeight { get; set; }
        public IDictionary<string, short[]> Animations { get; set; }
    }
}