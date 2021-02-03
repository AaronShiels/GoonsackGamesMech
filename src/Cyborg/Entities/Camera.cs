using Cyborg.Core;
using Microsoft.Xna.Framework;

namespace Cyborg.Entities
{
    public class Camera : IEntity
    {
        public Camera(Vector2 initialPosition)
        {
            Position = initialPosition;
        }

        public Vector2 Position { get; set; }
        public bool Destroyed { get; set; }
    }
}