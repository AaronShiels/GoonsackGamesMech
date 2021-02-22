using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Xna.Framework;
using static Cyborg.Utilities.MathsExtensions;

namespace Cyborg.Utilities
{
    public struct Sector
    {
        public Sector(Point centre, int radius, double minimumAngle, double maximumAngle)
        {
            Centre = centre;
            Radius = radius;
            MinimumAngle = (minimumAngle + FullCircleAngle) % FullCircleAngle;
            MaximumAngle = (maximumAngle + FullCircleAngle) % FullCircleAngle;
        }

        public Point Centre { get; }
        public int Radius { get; }
        public double MinimumAngle { get; }
        public double MaximumAngle { get; }

        public bool Intersects(Rectangle rectangle)
        {
            var centreDistanceX = Math.Abs(Centre.X - rectangle.Center.X);
            var centreDistanceY = Math.Abs(Centre.Y - rectangle.Center.Y);

            var isDefinitelyOutside = centreDistanceX > (rectangle.Width / 2 + Radius) || centreDistanceY > (rectangle.Height / 2 + Radius);
            if (isDefinitelyOutside)
                return false;

            var circleCentre = Centre;
            var rectangleVertexAngles = rectangle
                .ToVertices()
                .Select(v =>
                {
                    var vector = v - circleCentre;
                    var angle = Math.Atan2(vector.Y, vector.X);
                    return (angle + FullCircleAngle) % FullCircleAngle;
                });

            var minimumAngle = MinimumAngle;
            var maximumAngle = MaximumAngle;
            var anyVerticesInArc = maximumAngle >= minimumAngle
                ? rectangleVertexAngles.Any(a => a >= minimumAngle && a < maximumAngle)
                : rectangleVertexAngles.Any(a => a <= minimumAngle || a > maximumAngle);

            return anyVerticesInArc;
        }

        public IEnumerable<Vector2> ToVertices(double verticesPerRadiusSquared = 0.25d)
        {
            var adjustedMaximumAngle = MaximumAngle >= MinimumAngle ? MaximumAngle : MaximumAngle + FullCircleAngle;
            var centreVector = Centre.ToVector2();
            var arcAngle = adjustedMaximumAngle - MinimumAngle;
            var arcRatio = arcAngle / FullCircleAngle;
            var vertexCount = Math.Pow(Radius, 2) * verticesPerRadiusSquared * arcRatio;
            var angleIncrement = arcAngle / vertexCount;

            for (var angle = MinimumAngle; angle < adjustedMaximumAngle; angle += angleIncrement)
                yield return centreVector + Radius * new Vector2((float)Math.Cos(angle), (float)Math.Sin(angle));
        }
    }
}