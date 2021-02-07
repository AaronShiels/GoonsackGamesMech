namespace Cyborg.Core
{
    public interface IGameState
    {
        bool Active { get; }
        bool Debug { get; }
        bool Transitioning { get; }
    }
}