using System.Linq;
using Microsoft.Xna.Framework.Content.Pipeline;

namespace Cyborg.ContentPipeline.Animation
{
    [ContentProcessor(DisplayName = "Animation Processor")]
    public class AnimationProcessor : ContentProcessor<AnimationSetJson, AnimationSet>
    {
        public override AnimationSet Process(AnimationSetJson input, ContentProcessorContext context)
        {
            var animations = input.Animations
                .ToDictionary(x => x.Key, x => x.Frames.Select(f => (f[0] * input.FrameWidth, f[1] * input.FrameHeight, input.FrameWidth, input.FrameHeight)).ToArray());

            return new AnimationSet
            {
                Animations = animations,
                FrameRate = input.FrameRate
            };
        }
    }
}