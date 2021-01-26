using Cyborg.Sprites;

namespace Cyborg.Components
{
    public interface ISpriteMap : IBody
    {
        SpriteMapContainer SpriteMapContainer { get; }
    }
}