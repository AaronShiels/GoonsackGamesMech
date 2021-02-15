using System.Collections.Generic;
using System.Linq;
using Microsoft.Xna.Framework.Content.Pipeline;

namespace Cyborg.ContentPipeline.Animations
{
    [ContentProcessor(DisplayName = "Animation Processor")]
    public class AnimationProcessor : ContentProcessor<IDictionary<string, AnimationJson>, AnimationSet>
    {
        public override AnimationSet Process(IDictionary<string, AnimationJson> input, ContentProcessorContext context)
        {
            var animations = input.ToDictionary(x => x.Key, x => Map(x.Value));
            return new AnimationSet(animations);
        }

        private static Animation Map(AnimationJson json) => new()
        {
            Repeat = json.Repeat,
            FrameRate = json.FrameRate,
            FrameCount = json.FrameCount
        };
    }
}