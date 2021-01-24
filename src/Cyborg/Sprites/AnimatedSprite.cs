using System.Collections.Generic;
using System.Linq;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace Cyborg.Sprites
{
    public class AnimatedSprite
    {
        private readonly Texture2D _texture;
        private readonly IDictionary<string, AnimationDefinition> _animations;

        private AnimationDefinition _currentAnimation;
        private float _currentAnimationElapsed;

        public AnimatedSprite(Texture2D texture, IDictionary<string, AnimationDefinition> animations)
        {
            _texture = texture;
            _animations = animations;

            // Initialise
            _currentAnimation = _animations.First().Value;
            _currentAnimationElapsed = 0.0f;
        }

        public Texture2D Texture => _texture;
        public Rectangle Frame
        {
            get
            {
                var currentFrameIndex = (int)(_currentAnimationElapsed / _currentAnimation.FrameDuration);
                var offsetX = currentFrameIndex * _currentAnimation.FrameWidth;
                var offsetY = _currentAnimation.RowIndex * _currentAnimation.FrameHeight;

                return new Rectangle(offsetX, offsetY, _currentAnimation.FrameWidth, _currentAnimation.FrameHeight);
            }
        }

        public void Play(string animation)
        {
            var newAnimation = _animations[animation];
            if (_currentAnimation == newAnimation)
                return;

            _currentAnimationElapsed = 0f;
            _currentAnimation = newAnimation;
        }

        public void Update(float elapsed)
        {
            _currentAnimationElapsed += elapsed;

            if (_currentAnimationElapsed > _currentAnimation.TotalDuration)
                _currentAnimationElapsed %= _currentAnimation.TotalDuration;
        }
    }
}