using System;
using System.Linq;
using Cyborg.Utilities;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace Cyborg.Graphics
{
    public class PrimitiveBatch : IDisposable
    {
        private const double _pointsPerRadiusSquared = 0.5d;

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
            var topLeft = rectangle.Location.ToVector2();
            var topRight = topLeft + new Vector2(rectangle.Width, 0);
            var bottomLeft = topLeft + new Vector2(0, rectangle.Height);
            var bottomRight = topLeft + new Vector2(rectangle.Width, rectangle.Height);

            DrawLine(topLeft, topRight, colour);
            DrawLine(topLeft, bottomLeft, colour);
            DrawLine(topRight, bottomRight, colour);
            DrawLine(bottomLeft, bottomRight, colour);
        }

        public void Draw(Circle circle, Color colour, double minRadians = 0, double maxRadians = 2 * Math.PI)
        {
            var fullCircleRadians = 2 * Math.PI;
            var safeMinRadian = fullCircleRadians + minRadians;
            var safeMaxRadian = fullCircleRadians + maxRadians;
            var centre = circle.Centre.ToVector2();
            var vertexCount = (int)Math.Round(circle.Radius * circle.Radius * _pointsPerRadiusSquared);
            var radianIncrement = fullCircleRadians / vertexCount;
            var edges = Enumerable.Range(0, vertexCount - 1)
                .Where(i => radianIncrement * i + fullCircleRadians > safeMinRadian && radianIncrement * i + fullCircleRadians < safeMaxRadian)
                .Select(i =>
                {
                    var startRad = radianIncrement * i;
                    var endRad = radianIncrement * (i + 1);
                    var start = centre + circle.Radius * new Vector2((float)Math.Cos(startRad), (float)Math.Sin(startRad));
                    var end = centre + circle.Radius * new Vector2((float)Math.Cos(endRad), (float)Math.Sin(endRad));

                    return (Start: start, End: end);
                })
                .ToList();

            foreach (var (start, end) in edges)
            {
                AddVertex(start, colour);
                AddVertex(end, colour);
            }

            if (minRadians == 0 && maxRadians == fullCircleRadians)
            {
                AddVertex(edges.Last().End, colour);
                AddVertex(edges.First().Start, colour);
            }
            else
            {
                AddVertex(edges.Last().End, colour);
                AddVertex(centre, colour);

                AddVertex(edges.First().Start, colour);
                AddVertex(centre, colour);


            }
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