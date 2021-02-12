using Cyborg.Components;
using Microsoft.Xna.Framework;

namespace Cyborg.Entities
{
    public class ObstacleTile : ISprite, IBody
    {
        public ObstacleTile(SpriteComponent sprite, Vector2 position, Point size, Edge edges)
        {
            Sprite = sprite;
            Position = position;
            Size = size;
            Edges = edges;
        }

        public SpriteComponent Sprite { get; }
        public Vector2 Position { get; set; }
        public Point Size { get; }
        public Edge Edges { get; }
        public bool Destroyed { get; set; }
    }
}