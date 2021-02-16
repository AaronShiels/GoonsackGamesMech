namespace Cyborg.Components
{
    public interface IState<TStateComponent> where TStateComponent : class
    {
        TStateComponent State { get; }
    }
}