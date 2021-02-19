using System;
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

        public Vector2 Position { get; set; }
    }
}