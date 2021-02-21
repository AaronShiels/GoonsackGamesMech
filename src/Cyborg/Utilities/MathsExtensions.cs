using System;
using Microsoft.Xna.Framework;

namespace Cyborg.Utilities
{
    public static class MathsExtensions
    {
        public static Vector2 ToVector2(this Point point) => new(point.X, point.Y);

        public static Point ToRoundedPoint(this Vector2 vector) => Vector2.Round(vector).ToPoint();

        public static Rectangle CreateRectangleFromCentre(Point centre, Point size) => new(centre.X - size.X / 2, centre.Y - size.Y / 2, size.X, size.Y);

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
    }
}