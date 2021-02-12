using Microsoft.Xna.Framework;

namespace Cyborg.Components
{
    public class KineticComponent
    {
        public KineticComponent(float mass)
        {
            Mass = mass;
        }

        public float Mass { get; }
        public Vector2 Force { get; set; }
        public Vector2 Velocity { get; set; }
    }

    public interface IKinetic : IBody
    {
        KineticComponent Kinetic { get; }
    }
}