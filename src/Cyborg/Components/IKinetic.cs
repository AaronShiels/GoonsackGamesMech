using Cyborg.Core;
using Microsoft.Xna.Framework;

namespace Cyborg.Components
{
    public interface IKinetic : IBody
    {
        float Mass { get; }
        Vector2 Force { get; set; }
        Vector2 Velocity { get; set; }
    }
}