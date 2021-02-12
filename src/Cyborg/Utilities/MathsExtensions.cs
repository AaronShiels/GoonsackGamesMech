using System;
using Microsoft.Xna.Framework;

namespace Cyborg.Utilities
{
    public static class MathsExtensions
    {
        public static Vector2 ToCardinal(this Vector2 direction)
        {
            const float _directionThreshold = 0.01f;

            if (direction == Vector2.Zero)
                return direction;

            var horizontalMagnitude = Math.Abs(direction.X);
            var verticalMagnitude = Math.Abs(direction.Y);

            if (horizontalMagnitude > verticalMagnitude - _directionThreshold)
                return Vector2.UnitX * (direction.X > 0 ? 1 : -1);

            return Vector2.UnitY * (direction.Y > 0 ? 1 : -1);
        }
    }
}