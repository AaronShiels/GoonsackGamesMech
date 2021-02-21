using Microsoft.Xna.Framework;

namespace Cyborg.Utilities
{
    public struct Circle
    {
        public Circle(Point centre, int radius)
        {
            Centre = centre;
            Radius = radius;
        }

        public Point Centre { get; }
        public int Radius { get; }
    }
}