namespace Cyborg.Core
{
    public interface IGameState
    {
        bool Active { get; }
        bool Transitioning { get; set; }
    }
}