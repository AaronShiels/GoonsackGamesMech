namespace Cyborg.Core
{
    public class GameState : IGameState
    {
        public bool Active => !Transitioning;
        public bool Transitioning { get; set; }
        public bool Debug { get; set; }
    }
}