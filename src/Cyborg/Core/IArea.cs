using Microsoft.Xna.Framework;

namespace Cyborg.Core
{
    public interface IArea
    {
        Rectangle Bounds { get; }
        void Load();
        void Unload();
    }
}