using Microsoft.Xna.Framework;

namespace Cyborg.Core
{
    public interface ICamera
    {
        Vector2 Position { get; set; }
        Rectangle Bounds { get; }
        Matrix Projection { get; }
    }
}