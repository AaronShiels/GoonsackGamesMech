using Cyborg.Components;
using Microsoft.Xna.Framework;

namespace Cyborg.Entities
{
    public class Player : IState<PlayerStateComponent>, IControlled, IKinetic, ISprite
    {
        public Player(AnimatedSpriteComponent sprite, BodyComponent body)
        {
            Sprite = sprite;
            Body = body;
        }

        public PlayerStateComponent State { get; } = new();
        public ControllerComponent Controller { get; set; } = new();
        public KineticComponent Kinetic { get; } = new();
        public BodyComponent Body { get; }
        public ISpriteComponent Sprite { get; }
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
        public const string AnimationAttack2Right = "attack_2_right";
        public const string AnimationAttack2Up = "attack_2_up";
        public const string AnimationAttack2Left = "attack_2_left";
        public const string AnimationAttack2Down = "attack_2_down";
    }

    public class PlayerStateComponent
    {
        public Vector2 Direction { get; set; } = Vector2.UnitX;

        public bool Walking { get; set; }

        public bool Attacking { get; set; }
        public float AttackElapsed { get; set; }
        public int AttackCounter { get; set; }
        public int AttackRadius => 18;
        public (double Minimum, double Maximum) AttackAngles { get; set; } = (0, 0);

        public bool Dashing { get; set; }
        public float DashElapsed { get; set; }
    }
}