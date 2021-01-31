using Cyborg.Components;
using Microsoft.Xna.Framework;

namespace Cyborg.Entities
{
    public class FloorTile : ISprite
    {
        public FloorTile(Vector2 position, string spriteSheet, Rectangle spriteFrame)
        {
            Position = position;
            SpriteSheet = spriteSheet;
            SpriteFrame = spriteFrame;
        }

        public string SpriteSheet { get; }
        public Rectangle? SpriteFrame { get; set; }
        public Vector2 Position { get; set; }
        public bool Destroyed { get; set; }
    }
}