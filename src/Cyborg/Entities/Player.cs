using Cyborg.Components;
using Microsoft.Xna.Framework;

namespace Cyborg.Entities
{
    public class Player : IState<PlayerState>, IControlled, IKinetic, IAnimated
    {
        public Player(SpriteComponent sprite, AnimationComponent animation, BodyComponent body, KineticComponent kinetic)
        {
            Sprite = sprite;
            Animation = animation;
            Body = body;
            Kinetic = kinetic;
        }

        public Vector2 Direction { get; set; } = Vector2.UnitX;
        public StateComponent<PlayerState> State { get; } = new StateComponent<PlayerState>(PlayerState.Standing);
        public ControllerComponent Controller { get; set; }
        public KineticComponent Kinetic { get; }
        public BodyComponent Body { get; }
        public AnimationComponent Animation { get; }
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
        public const string AnimationAttackRight = "attack_right";
        public const string AnimationAttackUp = "attack_up";
        public const string AnimationAttackLeft = "attack_left";
        public const string AnimationAttackDown = "attack_down";
    }

    public enum PlayerState
    {
        Standing,
        Walking,
        Attacking,
        Dashing
    }
}