using System.Collections.Generic;
using System.Linq;
using Cyborg.ContentPipeline;
using Microsoft.Xna.Framework;

namespace Cyborg.Components
{
    public interface IAnimated : ISprite
    {
        AnimationComponent Animation { get; }
    }

    public class AnimationComponent
    {
        private readonly IDictionary<string, Rectangle[]> _animations;
        private readonly int _frameRate;

        public AnimationComponent(IDictionary<string, Rectangle[]> animations, int frameRate, string initialAnimation = null)
        {
            _animations = animations;
            _frameRate = frameRate;
            Current = initialAnimation ?? _animations.Keys.First();
        }

        public string Current { get; private set; }
        public float Elapsed { get; private set; }
        public Rectangle Frame => _animations[Current][(int)(Elapsed * _frameRate) % _animations[Current].Length];

        public void Update(string animation)
        {
            if (Current == animation)
                return;

            Current = animation;
            Elapsed = 0;
        }

        public void Update(float elapsed) => Elapsed += elapsed;

        public static AnimationComponent FromDefinition(AnimationSet animationSet, string initialAnimation = null)
        {
            var animations = animationSet.Animations.ToDictionary(kvp => kvp.Key, kvp => kvp.Value.Select(v => new Rectangle(v.X, v.Y, v.Width, v.Height)).ToArray());
            return new(animations, animationSet.FrameRate, initialAnimation);
        }
    }
}