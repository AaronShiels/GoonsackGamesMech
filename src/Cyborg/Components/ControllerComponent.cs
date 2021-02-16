using System.Collections.Generic;
using Microsoft.Xna.Framework;

namespace Cyborg.Components
{
    public class ControllerComponent
    {
        public Vector2 Joystick { get; private set; }
        public IEnumerable<Button> Pressed { get; private set; }
        public IEnumerable<Button> Held { get; private set; }

        public void Update(Vector2 joystick, IEnumerable<Button> pressed, IEnumerable<Button> held)
        {
            Joystick = joystick;
            Pressed = pressed;
            Held = held;
        }
    }

    public enum Button
    {
        Debug,
        Attack,
        Dash
    }

    public interface IControlled
    {
        ControllerComponent Controller { get; }
    }
}