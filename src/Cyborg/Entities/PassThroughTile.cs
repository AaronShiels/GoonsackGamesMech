using Cyborg.Components;

namespace Cyborg.Entities
{
    public class PassThroughTile : ISprite
    {
        public PassThroughTile(SpriteComponent sprite, BodyComponent body)
        {
            Sprite = sprite;
            Body = body;
        }

        public SpriteComponent Sprite { get; }
        public BodyComponent Body { get; }
        public bool Destroyed { get; set; }

    }
}