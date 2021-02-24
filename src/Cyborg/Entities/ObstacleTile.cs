using Cyborg.Components;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace Cyborg.Entities
{
    public class ObstacleTile : ISprite
    {
        private ObstacleTile(StaticSpriteComponent sprite, BodyComponent body)
        {
            Sprite = sprite;
            Body = body;
        }

        public ISpriteComponent Sprite { get; }
        public BodyComponent Body { get; }
        public bool Destroyed { get; set; }

        public static ObstacleTile FromMapData(Point position, Point size, Edge edges, Texture2D spriteSheet, Rectangle spriteFrame, int order)
        {
            var sprite = new StaticSpriteComponent(spriteSheet, spriteFrame, default, order);
            var body = new BodyComponent(position.ToVector2(), size, edges);
            return new ObstacleTile(sprite, body);
        }
    }
}