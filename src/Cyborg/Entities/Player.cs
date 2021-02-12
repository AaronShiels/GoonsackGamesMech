using Cyborg.Components;

namespace Cyborg.Entities
{
    public class Player : IAnimated, IKinetic
    {
        public Player(SpriteComponent sprite, AnimationComponent animation, BodyComponent body, KineticComponent kinetic)
        {
            Sprite = sprite;
            Animation = animation;
            Body = body;
            Kinetic = kinetic;
        }

        public AnimationComponent Animation { get; }
        public BodyComponent Body { get; }
        public KineticComponent Kinetic { get; }
        public SpriteComponent Sprite { get; }
        public bool Destroyed { get; set; }

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