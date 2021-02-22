using System;
using System.Collections.Generic;
using Microsoft.Xna.Framework;
using static Cyborg.Utilities.MathsExtensions;

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

        public bool Intersects(Rectangle rectangle)
        {
            var centreDistanceX = Math.Abs(Centre.X - rectangle.Center.X);
            var centreDistanceY = Math.Abs(Centre.Y - rectangle.Center.Y);

            var isDefinitelyOutside = centreDistanceX > (rectangle.Width / 2 + Radius) || centreDistanceY > (rectangle.Height / 2 + Radius);
            if (isDefinitelyOutside)
                return false;

            var isDefinitelyInside = centreDistanceX <= rectangle.Width / 2 || centreDistanceY <= rectangle.Height / 2;
            if (isDefinitelyInside)
                return true;

            var cornerDistanceSquared = Math.Pow(centreDistanceX - rectangle.Width / 2, 2) + Math.Pow(centreDistanceY - rectangle.Height / 2, 2);
            return cornerDistanceSquared <= Math.Pow(Radius, 2);
        }

        public IEnumerable<Vector2> ToVertices(double verticesPerRadiusSquared = 0.25d)
        {
            var centreVector = Centre.ToVector2();
            var vertexCount = Math.Pow(Radius, 2) * verticesPerRadiusSquared;
            var angleIncrement = FullCircleAngle / vertexCount;

            for (var angle = 0d; angle < FullCircleAngle; angle += angleIncrement)
                yield return centreVector + Radius * new Vector2((float)Math.Cos(angle), (float)Math.Sin(angle));
        }
    }
}