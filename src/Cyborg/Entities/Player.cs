using Cyborg.Components;
using Microsoft.Xna.Framework;

namespace Cyborg.Entities
{
    public class Player : IPlayer
    {
        public Player(Vector2 initialPosition)
        {
            Position = initialPosition;
        }

        public Vector2 Direction { get; set; } = new Vector2(1, 0);
        public float Mass => 1;
        public Vector2 Force { get; set; } = new(0, 0);
        public Vector2 Velocity { get; set; } = new(0, 0);
        public Vector2 Position { get; set; }
        public Point Size => new(16, 16);
        public bool Destroyed { get; set; }
        public string AnimationSet => "player_animations";
        public string Animation { get; set; } = AnimationWalkRight;
        public float AnimationElapsed { get; set; }
        public string SpriteSheet => "player_spritesheet";
        public Rectangle? SpriteFrame { get; set; } = null;
        public Edge Edges => Edge.Left | Edge.Top | Edge.Right | Edge.Bottom;

        // Animations
        public const string AnimationWalkRight = "walk_right";
        public const string AnimationWalkUpRight = "walk_up_right";
        public const string AnimationWalkUp = "walk_up";
        public const string AnimationWalkUpLeft = "walk_up_left";
        public const string AnimationWalkLeft = "walk_left";
        public const string AnimationWalkDownLeft = "walk_down_left";
        public const string AnimationWalkDown = "walk_down";
        public const string AnimationWalkDownRight = "walk_down_right";
    }
}