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
        private static readonly IDictionary<Keys, Button> _keyMapping = new Dictionary<Keys, Button>
        {
            {Keys.F12, Button.Debug}
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
            var currentState = Keyboard.GetState();

            // Calculate buttons
            _previousButtons = _currentButtons;
            _currentButtons = _keyMapping.Where(x => currentState.IsKeyDown(x.Key)).Select(x => x.Value).ToList();

            // Calculate direction
            var horizontalInput = (currentState.IsKeyDown(Keys.D) ? 1 : 0) + (currentState.IsKeyDown(Keys.A) ? -1 : 0);
            var verticalInput = (currentState.IsKeyDown(Keys.S) ? 1 : 0) + (currentState.IsKeyDown(Keys.W) ? -1 : 0);
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
    }
}