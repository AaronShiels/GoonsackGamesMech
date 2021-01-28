using Cyborg.Core;
using Microsoft.Xna.Framework;

namespace Cyborg.Components
{
    public interface IControllable : IEntity
    {
        Vector2 Direction { get; set; }
    }
}