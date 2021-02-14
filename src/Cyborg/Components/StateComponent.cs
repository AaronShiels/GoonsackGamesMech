using System;

namespace Cyborg.Components
{
    public class StateComponent<TState> where TState : struct, IConvertible
    {
        private TState _current;

        public StateComponent(TState initial)
        {
            if (!typeof(TState).IsEnum)
                throw new ArgumentException(nameof(TState));
        }

        public TState Current
        {
            get => _current;
            set
            {
                if (_current.Equals(value))
                    return;

                _current = value;
                Elapsed = 0f;
            }
        }
        public float Elapsed { get; set; } = 0f;
    }

    public interface IState<TState> where TState : struct, IConvertible
    {
        StateComponent<TState> State { get; }
    }
}