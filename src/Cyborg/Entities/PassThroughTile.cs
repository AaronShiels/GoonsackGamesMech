using Cyborg.Components;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace Cyborg.Entities
{
    public class PassThroughTile : ISprite
    {
        private PassThroughTile(StaticSpriteComponent sprite, BodyComponent body)
        {
            Sprite = sprite;
            Body = body;
        }

        public ISpriteComponent Sprite { get; }
        public BodyComponent Body { get; }
        public bool Destroyed { get; set; }

        public static PassThroughTile FromMapData(Point position, Texture2D spriteSheet, Rectangle spriteFrame, int order)
        {
            var sprite = new StaticSpriteComponent(spriteSheet, spriteFrame, default, order);
            var body = new BodyComponent(position.ToVector2());
            return new PassThroughTile(sprite, body);
        }
    }
}