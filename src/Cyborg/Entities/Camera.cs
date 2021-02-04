using System.Collections.Generic;
using System.Linq;
using Cyborg.Core;
using Microsoft.Xna.Framework;

namespace Cyborg.Entities
{
    public class Camera : IEntity
    {
        public Camera(Vector2 initialPosition, IEnumerable<Rectangle> areas)
        {
            Position = initialPosition;
            Areas = areas.OrderBy(a => a.X).ThenBy(a => a.Y).ToList();
        }

        public Vector2 Position { get; set; }
        public IList<Rectangle> Areas { get; }
        public bool Destroyed { get; set; }
    }
}