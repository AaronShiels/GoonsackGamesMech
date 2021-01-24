using MonoGame.Extended.Sprites;

namespace Cyborg.Components
{
    public interface IAnimatedSprite : IBody
    {
        AnimatedSprite AnimatedSprite { get; }
        string CurrentAnimation { get; set; }
    }
}