using Cyborg.Components;
using Microsoft.Xna.Framework;

namespace Cyborg.Entities
{
    public class WallTile : ISprite, IBody
    {
        public WallTile(Vector2 position, Point size, Edge edges, string spriteSheet, Rectangle spriteFrame)
        {
            Position = position;
            Size = size;
            Edges = edges;
            SpriteSheet = spriteSheet;
            SpriteFrame = spriteFrame;
        }

        public string SpriteSheet { get; }
        public Rectangle? SpriteFrame { get; set; }
        public Vector2 Position { get; set; }
        public Point Size { get; }
        public Edge Edges { get; }
        public bool Destroyed { get; set; }
    }
}