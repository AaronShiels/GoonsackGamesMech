using Cyborg.Components;

namespace Cyborg.Entities
{
    public class PassThroughTile : ISprite
    {
        public PassThroughTile(StaticSpriteComponent sprite, BodyComponent body)
        {
            Sprite = sprite;
            Body = body;
        }

        public ISpriteComponent Sprite { get; }
        public BodyComponent Body { get; }
        public bool Destroyed { get; set; }

    }
}