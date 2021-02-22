using Cyborg.Core;

namespace Cyborg.Components
{
    public interface IState<TState> : IEntity where TState : class
    {
        TState State { get; }
    }
}