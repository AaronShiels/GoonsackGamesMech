using System;
using System.Linq;
using Cyborg.Utilities;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using static Cyborg.Utilities.MathsExtensions;

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

        public void Begin(SamplerState samplerState, Matrix? transform)
        {
            if (_hasBegun)
                throw new InvalidOperationException("Current batch has already started.");

            var baseProjection = Matrix.CreateOrthographicOffCenter(0, _graphicsDevice.Viewport.Width, _graphicsDevice.Viewport.Height, 0, 0, 1f);
            _basicEffect.Projection = (transform ?? Matrix.Identity) * baseProjection;

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

        public void Draw(Rectangle rectangle, Color colour)
        {
            var vertices = rectangle.ToVertices().Select(v => v.ToVector2()).ToArray();
            for (var i = 0; i < vertices.Length; i++)
                DrawLine(vertices[i], vertices[i + 1 % vertices.Length], colour);
        }

        public void Draw(Circle circle, Color colour)
        {
            var vertices = circle.ToVertices().ToArray();
            for (var i = 0; i < vertices.Length; i++)
                DrawLine(vertices[i], vertices[i + 1 % vertices.Length], colour);
        }

        public void Draw(Sector sector, Color colour)
        {
            var vertices = sector.ToVertices().ToArray();
            for (var i = 0; i < vertices.Length - 1; i++)
                DrawLine(vertices[i], vertices[i + 1], colour);

            var centreVector = sector.Centre.ToVector2();
            DrawLine(vertices[0], centreVector, colour);
            DrawLine(vertices[^1], centreVector, colour);
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