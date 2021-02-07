using System.Collections.Generic;
using Microsoft.Xna.Framework;

namespace Cyborg.Core
{
    public interface IGameController
    {
        Vector2 Direction { get; }
        IEnumerable<Button> Pressed { get; }
        IEnumerable<Button> Held { get; }
    }

    public enum Button
    {
        Debug
    }
}