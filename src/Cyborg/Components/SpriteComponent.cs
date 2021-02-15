using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace Cyborg.Components
{
    public interface ISpriteComponent
    {
        string Animation { get; set; }
        float Elapsed { get; set; }
        Texture2D Texture { get; }
        Rectangle Frame { get; }
        Point Offset { get; }
        int Order { get; }
    }

    public class StaticSpriteComponent : ISpriteComponent
    {
        public StaticSpriteComponent(Texture2D texture, Rectangle? frame = null, Point offset = default, int order = 0)
        {
            Texture = texture;
            Frame = frame ?? texture.Bounds;
            Offset = offset;
            Order = order;
        }

        public string Animation { get => "default"; set { } }
        public float Elapsed { get => 0f; set { } }
        public Texture2D Texture { get; }
        public Rectangle Frame { get; }
        public Point Offset { get; }
        public int Order { get; }
    }

    public class AnimatedSpriteComponent : ISpriteComponent
    {
        private readonly IDictionary<string, Texture2D> _textures;
        private readonly IDictionary<string, AnimationDefinition> _animations;
        private string _current;

        public AnimatedSpriteComponent(IDictionary<string, (Texture2D SpriteSheet, int FrameCount, int FrameRate, bool Repeat)> animations, Point offset = default, int order = 0)
        {
            _textures = animations.ToDictionary(kvp => kvp.Key, kvp => kvp.Value.SpriteSheet);
            _animations = animations.ToDictionary(kvp => kvp.Key, kvp =>
            {
                var frameWidth = kvp.Value.SpriteSheet.Width / kvp.Value.FrameCount;
                var frameHeight = kvp.Value.SpriteSheet.Height;
                var frames = Enumerable.Range(0, kvp.Value.FrameCount)
                    .Select(i => new Rectangle(i * frameWidth, 0, frameWidth, frameHeight))
                    .ToArray();

                return new AnimationDefinition(frames, kvp.Value.FrameRate, kvp.Value.Repeat);
            });
            _current = animations.Keys.First();

            Offset = offset;
            Order = order;
        }

        public string Animation
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
        public Texture2D Texture => _textures[_current];
        public Rectangle Frame
        {
            get
            {
                var currentAnimation = _animations[Animation];
                var frameIndex = currentAnimation.Repeat
                    ? (int)(Elapsed * currentAnimation.FrameRate) % currentAnimation.Frames.Length
                    : Math.Min((int)(Elapsed * currentAnimation.FrameRate), currentAnimation.Frames.Length - 1);

                return currentAnimation.Frames[frameIndex];
            }
        }
        public Point Offset { get; }
        public int Order { get; }

        private class AnimationDefinition
        {
            public AnimationDefinition(Rectangle[] frames, int frameRate, bool repeat)
            {
                Frames = frames;
                FrameRate = frameRate;
                Repeat = repeat;
            }

            public Rectangle[] Frames { get; set; }
            public int FrameRate { get; set; }
            public bool Repeat { get; set; }
        }
    }

    public interface ISprite : IBody
    {
        ISpriteComponent Sprite { get; }
    }
}