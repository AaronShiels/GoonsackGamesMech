using System;
using System.Linq;
using Microsoft.Xna.Framework.Content.Pipeline;

namespace Cyborg.ContentPipeline.SpriteFactory
{
    [ContentProcessor(DisplayName = "Sprite Factory Processor")]
    public class SpriteFactoryProcessor : ContentProcessor<SpriteFactoryJson, AnimationSet>
    {
        public override AnimationSet Process(SpriteFactoryJson input, ContentProcessorContext context)
        {
            var animations = input.Cycles.ToDictionary(kvp => kvp.Key, kvp => kvp.Value.Frames);

            return new AnimationSet
            {
                SpriteSheet = input.TextureAtlas.Texture.Split('.').First(),
                FrameWidth = input.TextureAtlas.RegionWidth,
                FrameHeight = input.TextureAtlas.RegionHeight,
                Animations = animations
            };
        }
    }
}