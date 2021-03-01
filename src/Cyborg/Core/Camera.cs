using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using static Cyborg.Utilities.MathsExtensions;

namespace Cyborg.Core
{
    public class Camera : ICamera
    {
        private readonly GraphicsDevice _graphicsDevice;
        private readonly Point _size;

        private Vector2 _position;
        private Rectangle _bounds;
        private Matrix _projection;

        public Camera(GraphicsDevice graphicsDevice)
        {
            _graphicsDevice = graphicsDevice;
            _size = new(Constants.BaseWidth, Constants.BaseHeight);

            Recalculate();
        }

        public Vector2 Position
        {
            get => _position;
            set
            {
                if (value == _position)
                    return;

                _position = value;

                Recalculate();
            }
        }
        public Rectangle Bounds => _bounds;
        public Matrix Projection => _projection;

        private void Recalculate()
        {
            _bounds = CreateRectangleFromCentre(_position.ToRoundedPoint(), _size);

            var scale = Matrix.CreateScale(_graphicsDevice.Viewport.Width / Constants.BaseWidth, _graphicsDevice.Viewport.Height / Constants.BaseHeight, 1);
            var translate = Matrix.CreateTranslation(-_position.X + Constants.BaseWidth / 2, -_position.Y + Constants.BaseHeight / 2, 0);
            _projection = translate * scale;
        }
    }
}