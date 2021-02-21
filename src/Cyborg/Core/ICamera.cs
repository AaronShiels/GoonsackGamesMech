using Microsoft.Xna.Framework;

namespace Cyborg.Core
{
    public interface ICamera
    {
        Vector2 Position { get; set; }
        Point Size { get; }
        Rectangle Bounds { get; }
        Matrix Projection { get; }
    }
}