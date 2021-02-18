using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace Cyborg.Core
{
    public class Camera : ICamera
    {
        private readonly GraphicsDevice _graphicsDevice;

        public Camera(GraphicsDevice graphicsDevice)
        {
            _graphicsDevice = graphicsDevice;
        }

        public Point Position { get; set; }
        public Point Size { get; set; } = new(Constants.BaseWidth, Constants.BaseHeight);
        public Rectangle Bounds
        {
            get
            {
                var offsetX = Position.X - Size.X / 2;
                var offsetY = Position.Y - Size.Y / 2;

                return new(offsetX, offsetY, Size.X, Size.Y);
            }
        }
        public Viewport ViewPort
        {
            get
            {
                var screenX = _graphicsDevice.PresentationParameters.BackBufferWidth;
                var screenY = _graphicsDevice.PresentationParameters.BackBufferHeight;

                var ratioX = screenX / Size.X;
                var ratioY = screenY / Size.Y;
                var offsetX = Position.X * ratioX - screenX / 2; // TODO make vector?
                var offsetY = Position.Y * ratioY - screenY / 2; // TODO make vector?

                return new(offsetX, offsetY, screenX, screenY);
            }
        }
        public Matrix Transform
        {
            get
            {
                var screenX = _graphicsDevice.PresentationParameters.BackBufferWidth;
                var screenY = _graphicsDevice.PresentationParameters.BackBufferHeight;
                var ratioX = screenX / Constants.BaseWidth;
                var ratioY = screenY / Constants.BaseHeight;
                return Matrix.CreateScale(new Vector3(ratioX, ratioY, 1));
            }
        }
    }
}