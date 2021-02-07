using System.Collections.Generic;
using Microsoft.Xna.Framework;

namespace Cyborg.Core
{
    public class GameController : IGameController
    {
        public Vector2 Direction { get; set; }
        public IEnumerable<Button> Pressed { get; set; }
        public IEnumerable<Button> Held { get; set; }
    }
}