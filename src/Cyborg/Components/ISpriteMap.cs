using Cyborg.Sprites;

namespace Cyborg.Components
{
    public interface ISpriteMap : IBody
    {
        SpriteMap SpriteMap { get; }
    }
}