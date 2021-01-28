using Cyborg.Core;
using Microsoft.Xna.Framework;

namespace Cyborg.Components
{
    public interface ICollidable : IEntity
    {
        Point Size { get; set; }
    }
}