using Cyborg.Components;
using Microsoft.Xna.Framework;

namespace Cyborg.Entities
{
    public class Area : ISpriteMap
    {
        public Vector2 Position { get; set; } = Vector2.Zero;
        public Vector2 Size { get; set; } = new Vector2(320, 176);
        public string SpriteMap => "demo_map";
        public bool Destroyed { get; set; }
    }
}