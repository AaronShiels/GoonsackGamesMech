using Microsoft.Xna.Framework.Graphics;

namespace Cyborg.Sprites
{
    public class StaticSprite
    {
        private readonly Texture2D _texture;

        public StaticSprite(Texture2D texture)
        {
            _texture = texture;
        }

        public Texture2D Texture => _texture;
    }
}