using System;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace Cyborg.Graphics
{
    public class PrimitiveBatch : IDisposable
    {
        private readonly GraphicsDevice _graphicsDevice;
        private readonly BasicEffect _basicEffect;
        private readonly VertexPositionColor[] _vertexBuffer = new VertexPositionColor[1024];

        private int _vertexIndex;
        private bool _hasBegun;

        public PrimitiveBatch(GraphicsDevice graphicsDevice)
        {
            _graphicsDevice = graphicsDevice;
            _basicEffect = new BasicEffect(graphicsDevice)
            {
                VertexColorEnabled = true
            };
        }

        public void Begin(SamplerState samplerState)
        {
            if (_hasBegun)
                throw new InvalidOperationException("Current batch has already started.");

            _basicEffect.Projection = Matrix.CreateOrthographicOffCenter(0, Constants.BaseWidth, Constants.BaseHeight, 0, 0, 1f);
            _graphicsDevice.SamplerStates[0] = samplerState;

            _hasBegun = true;
        }

        public void End()
        {
            if (!_hasBegun)
                throw new InvalidOperationException("Current batch has not started.");

            Flush();

            _hasBegun = false;
        }

        public void DrawLine(Vector2 start, Vector2 end, Color colour)
        {
            AddVertex(start, colour);
            AddVertex(end, colour);
        }

        public void DrawRectangle(Rectangle rectangle, Color colour)
        {
            var topLeft = rectangle.Location.ToVector2();
            var topRight = topLeft + new Vector2(rectangle.Width, 0);
            var bottomLeft = topLeft + new Vector2(0, rectangle.Height);
            var bottomRight = topLeft + new Vector2(rectangle.Width, rectangle.Height);

            DrawLine(topLeft, topRight, colour);
            DrawLine(topLeft, bottomLeft, colour);
            DrawLine(topRight, bottomRight, colour);
            DrawLine(bottomLeft, bottomRight, colour);
        }

        public void Dispose() => _basicEffect.Dispose();

        private void AddVertex(Vector2 point, Color colour)
        {
            if (!_hasBegun)
                throw new InvalidOperationException("Current batch has not started.");

            if (_vertexIndex >= _vertexBuffer.Length)
                Flush();

            _vertexBuffer[_vertexIndex++] = new VertexPositionColor(new Vector3(point, 0f), colour);
        }

        private void Flush()
        {
            if (_vertexIndex < 2)
                return;

            foreach (var pass in _basicEffect.CurrentTechnique.Passes)
            {
                pass.Apply();

                var lines = _vertexIndex / 2;
                _graphicsDevice.DrawUserPrimitives(PrimitiveType.LineList, _vertexBuffer, 0, lines);
                _vertexIndex -= lines * 2;
            }
        }
    }
}