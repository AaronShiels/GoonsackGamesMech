using Cyborg.Core;
using Microsoft.Xna.Framework;

namespace Cyborg.Entities
{
    // Invert control up to world
    public class Area : IEntity
    {
        public Area(Rectangle bounds)
        {
            Bounds = bounds;
        }

        public Rectangle Bounds { get; }
        public bool Destroyed { get; set; }
    }
}