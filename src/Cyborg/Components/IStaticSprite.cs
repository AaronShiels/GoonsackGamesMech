using Cyborg.Sprites;

namespace Cyborg.Components
{
    public interface IStaticSprite : IBody
    {
        StaticSprite StaticSprite { get; }
    }
}