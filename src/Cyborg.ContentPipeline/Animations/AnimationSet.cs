using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace Cyborg.ContentPipeline.Animations
{
    [Serializable]
    public class AnimationSet : Dictionary<string, Animation>
    {
        public AnimationSet(SerializationInfo info, StreamingContext context) : base(info, context)
        { }

        public AnimationSet(IDictionary<string, Animation> animationDictionary) : base(animationDictionary)
        { }
    }

    [Serializable]
    public class Animation
    {
        public bool Repeat { get; set; }
        public int FrameRate { get; set; }
        public int FrameCount { get; set; }
    }
}