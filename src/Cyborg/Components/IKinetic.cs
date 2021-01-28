using Cyborg.Core;
using Microsoft.Xna.Framework;

namespace Cyborg.Components
{
    public interface IKinetic : IEntity
    {
        float Mass { get; }
        Vector2 Force { get; set; }
        Vector2 Velocity { get; set; }
    }
}