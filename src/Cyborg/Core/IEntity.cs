using Microsoft.Xna.Framework;

namespace Cyborg.Core
{
    public interface IEntity
    {
        Vector2 Position { get; set; }
        bool Destroyed { get; set; }
    }
}