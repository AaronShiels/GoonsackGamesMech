using Cyborg.Core;
using Microsoft.Xna.Framework;

namespace Cyborg.Entities
{
    // Invert control up to world
    public class Area : IEntity
    {
        private Area(Rectangle bounds)
        {
            Bounds = bounds;
        }

        public Rectangle Bounds { get; }
        public bool Destroyed { get; set; }

        public static Area FromMapData(Rectangle rectangle) => new(rectangle);
    }
}