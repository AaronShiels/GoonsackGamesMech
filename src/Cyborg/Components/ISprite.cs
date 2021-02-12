using Cyborg.Core;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace Cyborg.Components
{
    public interface ISprite : IEntity
    {
        SpriteComponent Sprite { get; }
    }

    public class SpriteComponent
    {
        public SpriteComponent(Texture2D texture, Rectangle frame = default, Point offset = default, int order = 0)
        {
            Texture = texture;
            Frame = frame != default ? frame : texture.Bounds;
            Offset = offset;
            Order = order;
        }

        public Texture2D Texture { get; }
        public Rectangle Frame { get; private set; }
        public Point Offset { get; }
        public int Order { get; }

        public void Update(Rectangle frame) => Frame = frame;
    }
}