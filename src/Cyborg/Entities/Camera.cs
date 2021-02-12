using System.Collections.Generic;
using System.Linq;
using Cyborg.Components;
using Microsoft.Xna.Framework;

namespace Cyborg.Entities
{
    public class Camera : IBody
    {
        public Camera(BodyComponent body, IEnumerable<Rectangle> areas)
        {
            Body = body;
            Areas = areas.OrderBy(a => a.X).ThenBy(a => a.Y).ToList();
        }

        public BodyComponent Body { get; }
        public IList<Rectangle> Areas { get; }
        public bool Destroyed { get; set; }
    }
}