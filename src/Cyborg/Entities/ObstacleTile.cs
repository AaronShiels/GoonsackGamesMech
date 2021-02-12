using Cyborg.Components;

namespace Cyborg.Entities
{
    public class ObstacleTile : ISprite
    {
        public ObstacleTile(SpriteComponent sprite, BodyComponent body)
        {
            Sprite = sprite;
            Body = body;
        }

        public SpriteComponent Sprite { get; }
        public BodyComponent Body { get; }
        public bool Destroyed { get; set; }
    }
}