using Microsoft.Xna.Framework;

namespace Cyborg.Components
{
    public interface IMovingBody : IBody
    {
        float Mass { get; }
        Vector2 Force { get; set; }
        Vector2 Velocity { get; set; }
    }
}