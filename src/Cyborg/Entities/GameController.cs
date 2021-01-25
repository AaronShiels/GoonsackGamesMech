using Cyborg.Components;
using Microsoft.Xna.Framework;

namespace Cyborg.Entities
{
    public class GameController : IGameController
    {
        public Vector2 Direction { get; set; }
        public bool Destroyed { get; set; }
    }
}