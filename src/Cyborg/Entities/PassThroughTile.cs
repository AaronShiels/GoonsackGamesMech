using Cyborg.Components;
using Microsoft.Xna.Framework;

namespace Cyborg.Entities
{
    public class PassThroughTile : ISprite
    {
        public PassThroughTile(Vector2 position, string spriteSheet, Rectangle spriteFrame, int order)
        {
            Position = position;
            SpriteSheet = spriteSheet;
            SpriteFrame = spriteFrame;
            Order = order;
        }

        public string SpriteSheet { get; }
        public Rectangle? SpriteFrame { get; set; }
        public Point SpriteOffset => Point.Zero;

        public int Order { get; }
        public Vector2 Position { get; set; }
        public bool Destroyed { get; set; }
    }
}