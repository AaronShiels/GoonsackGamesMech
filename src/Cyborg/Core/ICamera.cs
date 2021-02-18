using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace Cyborg.Core
{
    public interface ICamera
    {
        Point Position { get; set; }
        Point Size { get; set; }
        Rectangle Bounds { get; }
        Viewport ViewPort { get; }
        Matrix Transform { get; }
    }
}