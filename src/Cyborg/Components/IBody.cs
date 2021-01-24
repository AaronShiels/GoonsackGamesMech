using Cyborg.Core;
using Microsoft.Xna.Framework;

namespace Cyborg.Components
{
    public interface IBody : IEntity
    {
        Vector2 Position { get; set; }
        Vector2 Size { get; set; }
    }
}