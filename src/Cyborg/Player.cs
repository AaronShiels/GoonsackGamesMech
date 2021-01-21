using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;

namespace Cyborg
{
    public class Player2
    {
        private const float _acceleration = 400f;
        private const float _friction = 0.6f;
        private const int _width = 32;
        private const int _height = 32;

        private readonly Texture2D _texture;
        private Vector2 _position = new Vector2(16, 16);
        private Vector2 _velocity = new Vector2();

        public Player2(ContentManager content)
        {
            _texture = content.Load<Texture2D>("player");
        }

        public void Update(GameTime gameTime, KeyboardState keyboardState)
        {
            var elapsed = (float)gameTime.ElapsedGameTime.TotalSeconds;

            // Calculate direction
            var horizontalInput = keyboardState.IsKeyDown(Keys.D) ? 1 : keyboardState.IsKeyDown(Keys.A) ? -1 : 0;
            var verticalInput = keyboardState.IsKeyDown(Keys.S) ? 1 : keyboardState.IsKeyDown(Keys.W) ? -1 : 0;
            var direction = new Vector2(horizontalInput, verticalInput);

            // Apply acceleration
            if (direction != Vector2.Zero)
            {
                direction.Normalize();
                _velocity += direction * _acceleration * elapsed;
            }

            // Apply friction
            _velocity *= _friction;

            // Apply velocity
            _position += _velocity;

            // Apply collision
            if (_position.X - _width / 2 < 0 || _position.X + _width / 2 > 800)
            {
                _position.X = MathHelper.Clamp(_position.X, _width / 2, 800 - _width / 2);
                _velocity.X = 0;
            }
            if (_position.Y - _height / 2 < 0 || _position.Y + _height / 2 > 480)
            {
                _position.Y = MathHelper.Clamp(_position.Y, _height / 2, 480 - _height / 2);
                _velocity.Y = 0;
            }
        }

        public void Draw(GameTime gameTime, SpriteBatch spriteBatch)
        {
            spriteBatch.Draw(
                _texture,
                _position,
                null,
                Color.White,
                0f,
                new Vector2(_width / 2, _height / 2),
                Vector2.One,
                SpriteEffects.None,
                0f
            );
        }
    }
}