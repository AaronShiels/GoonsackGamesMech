using System;
using System.Collections.Generic;
using Microsoft.Xna.Framework;

namespace Cyborg.ContentPipeline
{
    [Serializable]
    public class AnimationSet
    {
        public int FrameRate { get; set; }
        public IDictionary<string, (int X, int Y, int Width, int Height)[]> Animations { get; set; }
    }
}