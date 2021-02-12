using Cyborg.Components;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace Cyborg.Entities
{
    public class PassThroughTile : ISprite
    {
        public PassThroughTile(SpriteComponent sprite, Vector2 position)
        {
            Sprite = sprite;
            Position = position;
        }

        public SpriteComponent Sprite { get; }
        public Vector2 Position { get; set; }
        public bool Destroyed { get; set; }

    }
}