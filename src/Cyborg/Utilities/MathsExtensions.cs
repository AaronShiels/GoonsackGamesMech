using System;
using System.Collections.Generic;
using Microsoft.Xna.Framework;

namespace Cyborg.Utilities
{
    public static class MathsExtensions
    {
        private const double _verticesPerRadiusSquared = 0.25d;
        private static readonly Random _random = new();

        public const double FullCircleAngle = 2 * Math.PI;

        public static Rectangle CreateRectangleFromCentre(Point centre, Point size) => new(centre.X - size.X / 2, centre.Y - size.Y / 2, size.X, size.Y);

        public static Point ToRoundedPoint(this Vector2 vector) => Vector2.Round(vector).ToPoint();

        public static Point ToCardinal(this Vector2 direction)
        {
            const float _directionThreshold = 0.01f;

            if (direction == Vector2.Zero)
                return Point.Zero;

            var horizontalMagnitude = Math.Abs(direction.X);
            var verticalMagnitude = Math.Abs(direction.Y);

            if (horizontalMagnitude > verticalMagnitude - _directionThreshold)
                return new Point(direction.X > 0 ? 1 : -1, 0);

            return new Point(0, direction.Y > 0 ? 1 : -1);
        }

        public static Vector2 CreateRandomVector2()
        {
            var randomX = (float)_random.NextDouble() * 2 - 1;
            var randomY = (float)_random.NextDouble() * 2 - 1;
            return Vector2.Normalize(new Vector2(randomX, randomY));
        }

        public static bool Intersects(this Rectangle rectangle, Circle circle) => circle.Intersects(rectangle);

        public static bool Intersects(this Rectangle rectangle, Sector sector) => sector.Intersects(rectangle);

        public static IEnumerable<Point> ToVertices(this Rectangle rectangle) => new[]
        {
            new Point(rectangle.Left, rectangle.Top),
            new Point(rectangle.Right, rectangle.Top),
            new Point(rectangle.Left, rectangle.Bottom),
            new Point(rectangle.Right, rectangle.Bottom)
        };

        public static IEnumerable<Vector2> ToVertices(Vector2 centre, int radius, double minimumAngle = 0, double maximumAngle = FullCircleAngle)
        {
            var arcAngle = maximumAngle - minimumAngle;
            var arcRatio = arcAngle / FullCircleAngle;
            var vertexCount = Math.Pow(radius, 2) * _verticesPerRadiusSquared * arcRatio;
            var angleIncrement = arcAngle / vertexCount;

            for (var angle = minimumAngle; angle < maximumAngle; angle += angleIncrement)
                yield return centre + radius * new Vector2((float)Math.Cos(angle), (float)Math.Sin(angle));
        }
    }
}