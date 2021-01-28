using Cyborg.Components;
using Microsoft.Xna.Framework;

namespace Cyborg.Entities
{
    public class Area : ISpriteMap, ICollisionMap
    {
        public Vector2 Position { get; set; } = Vector2.Zero;
        public string SpriteMap => "demo_map";
        public string CollisionMap => "demo_map";
        public bool Destroyed { get; set; }
    }
}