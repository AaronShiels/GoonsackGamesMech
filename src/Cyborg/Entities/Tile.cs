using Cyborg.Components;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace Cyborg.Entities
{
    public class Tile : ISprite
    {
        public Tile(Vector2 position, Point size, Edge edges, Texture2D spriteSheet, Rectangle spriteFrame, int order)
        {
            Sprite = new StaticSpriteComponent(spriteSheet, spriteFrame, default, order);
            Body = new BodyComponent(position, size, edges);
        }

        public ISpriteComponent Sprite { get; }
        public BodyComponent Body { get; }
        public bool Destroyed { get; set; }
    }
}