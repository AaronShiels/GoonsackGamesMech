using Cyborg.Core;
using Microsoft.Xna.Framework;

namespace Cyborg.Components
{
    public interface IGameController : IEntity
    {
        Vector2 Direction { get; }
    }
}