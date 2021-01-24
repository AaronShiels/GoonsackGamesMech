using Cyborg.Components;
using Microsoft.Xna.Framework;

namespace Cyborg.Entities
{
    public class Player : IPlayerControlled, ISprite
    {
        public float Mass => 1;
        public Vector2 Force { get; set; } = new Vector2(0, 0);
        public Vector2 Velocity { get; set; } = new Vector2(0, 0);
        public Vector2 Position { get; set; } = new Vector2(160, 90);
        public Vector2 Size { get; set; } = new Vector2(32, 32);
        public string Sprite => "player";
        public bool Destroyed { get; set; }
    }
}