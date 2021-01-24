using Microsoft.Xna.Framework.Graphics;

namespace Cyborg.Components
{
    public interface ISprite : IBody
    {
        Texture2D Sprite { get; }
    }
}