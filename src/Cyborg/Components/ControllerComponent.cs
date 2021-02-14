using System.Collections.Generic;
using Microsoft.Xna.Framework;

namespace Cyborg.Components
{
    public class ControllerComponent
    {
        public ControllerComponent(Vector2 direction, IEnumerable<Button> pressed, IEnumerable<Button> held)
        {
            Joystick = direction;
            Pressed = pressed;
            Held = held;
        }

        public Vector2 Joystick { get; }
        public IEnumerable<Button> Pressed { get; }
        public IEnumerable<Button> Held { get; }
    }

    public enum Button
    {
        Debug,
        Attack,
        Dash
    }

    public interface IControlled
    {
        ControllerComponent Controller { get; set; }
    }
}