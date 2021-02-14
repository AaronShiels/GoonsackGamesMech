using System.Collections.Generic;
using System.Linq;
using Cyborg.ContentPipeline;
using Microsoft.Xna.Framework;

namespace Cyborg.Components
{
    public class AnimationComponent
    {
        private readonly IDictionary<string, Rectangle[]> _animations;
        private readonly int _frameRate;

        private string _current;

        public AnimationComponent(IDictionary<string, Rectangle[]> animations, int frameRate, string initialAnimation = null)
        {
            _animations = animations;
            _frameRate = frameRate;
            Current = initialAnimation ?? _animations.Keys.First();
        }

        public string Current
        {
            get => _current;
            set
            {
                if (_current == value)
                    return;

                _current = value;
                Elapsed = 0f;
            }
        }
        public float Elapsed { get; set; }
        public Rectangle Frame => _animations[Current][(int)(Elapsed * _frameRate) % _animations[Current].Length];

        public static AnimationComponent FromDefinition(AnimationSet animationSet, string initialAnimation = null)
        {
            var animations = animationSet.Animations.ToDictionary(kvp => kvp.Key, kvp => kvp.Value.Select(v => new Rectangle(v.X, v.Y, v.Width, v.Height)).ToArray());
            return new(animations, animationSet.FrameRate, initialAnimation);
        }
    }

    public interface IAnimated : ISprite
    {
        AnimationComponent Animation { get; }
    }
}