namespace Cyborg.Components
{
    public interface IState<TState> where TState : class
    {
        TState State { get; }
    }
}