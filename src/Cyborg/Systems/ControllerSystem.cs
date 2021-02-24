using System;
using System.Collections.Generic;
using System.Linq;
using Cyborg.Components;
using Cyborg.Core;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Input;

namespace Cyborg.Systems
{
    public class ControllerSystem : IUpdateSystem
    {
        private static readonly IDictionary<Keys, Button> _keyboardMapping = new Dictionary<Keys, Button>
        {
            { Keys.F12, Button.Debug },
            { Keys.Space, Button.Dash }
        };
        private static readonly IDictionary<MouseButton, Button> _mouseMapping = new Dictionary<MouseButton, Button>
        {
            { MouseButton.Left, Button.Attack }
        };
        private readonly IEntityManager _entityManager;
        private IEnumerable<Button> _previousDownButtons = Enumerable.Empty<Button>();

        public ControllerSystem(IEntityManager entityManager)
        {
            _entityManager = entityManager;
        }

        public void Update(GameTime gameTime)
        {
            var currentKeyboardState = Keyboard.GetState();
            var currentMouseState = Mouse.GetState();

            // Calculate buttons
            var keyboardButtons = _keyboardMapping.Where(kvp => IsKeyDown(currentKeyboardState, kvp.Key)).Select(x => x.Value);
            var mouseButtons = _mouseMapping.Where(kvp => IsMouseButtonDown(currentMouseState, kvp.Key)).Select(x => x.Value);

            var downButtons = keyboardButtons.Concat(mouseButtons).Distinct().ToList();
            var pressedButtons = downButtons.Except(_previousDownButtons).ToList();
            _previousDownButtons = downButtons;

            // Calculate direction
            var horizontalInput = (currentKeyboardState.IsKeyDown(Keys.D) ? 1 : 0) + (currentKeyboardState.IsKeyDown(Keys.A) ? -1 : 0);
            var verticalInput = (currentKeyboardState.IsKeyDown(Keys.S) ? 1 : 0) + (currentKeyboardState.IsKeyDown(Keys.W) ? -1 : 0);
            var direction = new Vector2(horizontalInput, verticalInput);
            if (direction != Vector2.Zero)
                direction.Normalize();

            // Apply
            foreach (var entity in _entityManager.Entities<IControlled>())
                entity.Controller.Update(direction, pressedButtons, downButtons);
        }

        private enum MouseButton
        {
            Left,
            Right
        }

        private static bool IsMouseButtonDown(MouseState state, MouseButton button) => button switch
        {
            MouseButton.Left => state.LeftButton == ButtonState.Pressed,
            MouseButton.Right => state.RightButton == ButtonState.Pressed,
            _ => throw new ArgumentOutOfRangeException(nameof(button)),
        };

        private static bool IsKeyDown(KeyboardState state, Keys key) => state.IsKeyDown(key);
    }
}