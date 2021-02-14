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

        private readonly IReadOnlyCollection<IEntity> _entities;
        private readonly GameState _gameState;

        private IEnumerable<Button> _previousButtons = Enumerable.Empty<Button>();
        private IEnumerable<Button> _currentButtons = Enumerable.Empty<Button>();

        public ControllerSystem(IReadOnlyCollection<IEntity> entities, GameState gameState)
        {
            _entities = entities;
            _gameState = gameState;
        }

        public void Update(GameTime gameTime)
        {
            var currentKeyboardState = Keyboard.GetState();
            var currentMouseState = Mouse.GetState();

            // Calculate buttons
            var keyboardButtons = _keyboardMapping.Where(kvp => IsKeyDown(currentKeyboardState, kvp.Key)).Select(x => x.Value);
            var mouseButtons = _mouseMapping.Where(kvp => IsMouseButtonDown(currentMouseState, kvp.Key)).Select(x => x.Value);

            _previousButtons = _currentButtons;
            _currentButtons = keyboardButtons.Concat(mouseButtons).Distinct().ToList();

            // Calculate direction
            var horizontalInput = (currentKeyboardState.IsKeyDown(Keys.D) ? 1 : 0) + (currentKeyboardState.IsKeyDown(Keys.A) ? -1 : 0);
            var verticalInput = (currentKeyboardState.IsKeyDown(Keys.S) ? 1 : 0) + (currentKeyboardState.IsKeyDown(Keys.W) ? -1 : 0);
            var direction = new Vector2(horizontalInput, verticalInput);
            if (direction != Vector2.Zero)
                direction.Normalize();

            // Apply
            var controller = new ControllerComponent(direction, _currentButtons.Except(_previousButtons), _currentButtons);
            var controlledEntities = _entities.OfType<IControlled>();
            foreach (var entity in controlledEntities)
                entity.Controller = controller;

            // Debug
            if (controller.Pressed.Contains(Button.Debug))
                _gameState.Debug = !_gameState.Debug;
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