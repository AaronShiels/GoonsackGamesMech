using Cyborg.Core;
using Microsoft.Xna.Framework;

namespace Cyborg.Components
{
    public enum BodyType
    {
        Static,
        Dynamic
    }

    public interface IBody : IEntity
    {
        BodyType BodyType { get; }
        Vector2 Position { get; set; }
        Vector2 Velocity { get; set; }
        Vector2 Size { get; set; }
    }
}