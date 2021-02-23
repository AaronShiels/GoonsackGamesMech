using Microsoft.Xna.Framework;

namespace Cyborg.Components
{
    public class KineticComponent
    {
        public KineticComponent(float mass = 1, Vector2 initialVelocity = default)
        {
            Mass = mass;
            Velocity = initialVelocity;
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