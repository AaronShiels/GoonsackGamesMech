using System.Collections.Generic;
using Cyborg.Components;
using Cyborg.Sprites;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;

namespace Cyborg.Entities
{
    public class Player : IPlayer
    {
        private readonly AnimatedSprite _animatedSprite;

        public Player(ContentManager contentManager)
        {
            _animatedSprite = CreateAnimatedSprite(contentManager);
        }

        public float Mass => 1;
        public Vector2 Force { get; set; } = new Vector2(0, 0);
        public Vector2 Velocity { get; set; } = new Vector2(0, 0);
        public Vector2 Position { get; set; } = new Vector2(0, 0);
        public Vector2 Size { get; set; } = new Vector2(16, 16);
        public AnimatedSprite AnimatedSprite => _animatedSprite;
        public bool Destroyed { get; set; }

        // Animations
        public const string AnimationWalkRight = "walk_right";
        public const string AnimationWalkUpRight = "walk_up_right";
        public const string AnimationWalkUp = "walk_up";
        public const string AnimationWalkUpLeft = "walk_up_left";
        public const string AnimationWalkLeft = "walk_left";
        public const string AnimationWalkDownLeft = "walk_down_left";
        public const string AnimationWalkDown = "walk_down";
        public const string AnimationWalkDownRight = "walk_down_right";

        private static AnimatedSprite CreateAnimatedSprite(ContentManager contentManager)
        {
            var texture = contentManager.Load<Texture2D>("player");
            var animationDefinitions = new Dictionary<string, AnimationDefinition>
            {
                { AnimationWalkRight,  new AnimationDefinition(16, 16, 0, 2, 12) },
                { AnimationWalkUpRight,  new AnimationDefinition(16, 16, 1, 2, 12) },
                { AnimationWalkUp,  new AnimationDefinition(16, 16, 2, 2, 12) },
                { AnimationWalkUpLeft,  new AnimationDefinition(16, 16, 3, 2, 12) },
                { AnimationWalkLeft,  new AnimationDefinition(16, 16, 4, 2, 12) },
                { AnimationWalkDownLeft,  new AnimationDefinition(16, 16, 5, 2, 12) },
                { AnimationWalkDown,  new AnimationDefinition(16, 16, 6, 2, 12) },
                { AnimationWalkDownRight,  new AnimationDefinition(16, 16, 7, 2, 12) }
            };
            return new AnimatedSprite(texture, animationDefinitions);
        }
    }
}