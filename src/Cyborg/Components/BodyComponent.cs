using System;
using Cyborg.Core;
using Microsoft.Xna.Framework;
using static Cyborg.Utilities.MathsExtensions;

namespace Cyborg.Components
{
    public class BodyComponent
    {
        private readonly Point _size;
        private readonly Edge _edges;

        private Vector2 _position;
        private Rectangle _bounds;

        public BodyComponent(Vector2 position, Point size = default, Edge edges = Edge.None)
        {
            _position = position;
            _size = size;
            _edges = edges;

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
        public Point Size => _size;
        public Rectangle Bounds => _bounds;
        public Edge Edges => _edges;

        private void Recalculate()
        {
            _bounds = CreateRectangleFromCentre(_position.ToRoundedPoint(), Size);
        }
    }

    [Flags]
    public enum Edge
    {
        None = 0,
        Left = 1,
        Top = 2,
        Right = 4,
        Bottom = 8
    }

    public interface IBody : IEntity
    {
        BodyComponent Body { get; }
    }
}