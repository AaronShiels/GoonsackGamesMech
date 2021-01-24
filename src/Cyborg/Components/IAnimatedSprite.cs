using Cyborg.Sprites;

namespace Cyborg.Components
{
    public interface IAnimatedSprite : IBody
    {
        AnimatedSprite AnimatedSprite { get; }
    }
}