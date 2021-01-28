using Cyborg.Core;

namespace Cyborg.Components
{
    public interface IAnimatedSprite : IEntity
    {
        string AnimationSet { get; }
        string Animation { get; set; }
        float AnimationElapsed { get; set; }
    }
}