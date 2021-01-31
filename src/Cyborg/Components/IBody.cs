using System;
using Cyborg.Core;
using Microsoft.Xna.Framework;

namespace Cyborg.Components
{
    public interface IBody : IEntity
    {
        Point Size { get; }
        Edge Edges { get; }
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
}