using Cyborg.Components;
using Microsoft.Xna.Framework;

namespace Cyborg.Entities
{
    public class ObstacleTile : ISprite, IBody
    {
        public ObstacleTile(Vector2 position, Point size, Edge edges, string spriteSheet, Rectangle spriteFrame, int order)
        {
            Position = position;
            Size = size;
            Edges = edges;
            SpriteSheet = spriteSheet;
            SpriteFrame = spriteFrame;
            Order = order;
        }

        public string SpriteSheet { get; }
        public Rectangle? SpriteFrame { get; set; }
        public Point SpriteOffset => Point.Zero;
        public int Order { get; }
        public Vector2 Position { get; set; }
        public Point Size { get; }
        public Edge Edges { get; }
        public bool Destroyed { get; set; }
    }
}