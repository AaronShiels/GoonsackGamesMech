using System;
using Cyborg.Components;
using Microsoft.Xna.Framework;

namespace Cyborg.Entities
{
    public class Player : IKinetic, IAnimated
    {
        public Player(SpriteComponent sprite, AnimationComponent animation, Vector2 position)
        {
            Sprite = sprite;
            Animation = animation;
            Position = position;
        }

        public Vector2 Direction { get; set; } = new Vector2(1, 0);
        public float Mass => 1;
        public Vector2 Force { get; set; } = new(0, 0);
        public Vector2 Velocity { get; set; } = new(0, 0);
        public Vector2 Position { get; set; }
        public Point Size => new(8, 12);
        public bool Destroyed { get; set; }
        public Edge Edges => Edge.Left | Edge.Top | Edge.Right | Edge.Bottom;
        public AnimationComponent Animation { get; }
        public SpriteComponent Sprite { get; }

        // Animations
        public const string AnimationWalkRight = "walk_right";
        public const string AnimationWalkUp = "walk_up";
        public const string AnimationWalkLeft = "walk_left";
        public const string AnimationWalkDown = "walk_down";
        public const string AnimationStandRight = "stand_right";
        public const string AnimationStandUp = "stand_up";
        public const string AnimationStandLeft = "stand_left";
        public const string AnimationStandDown = "stand_down";
    }
}