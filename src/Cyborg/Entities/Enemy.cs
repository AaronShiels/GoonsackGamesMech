using Cyborg.Components;
using Microsoft.Xna.Framework;

namespace Cyborg.Entities
{
    public class Enemy : IState<EnemyStateComponent>, IKinetic, IDamageable, ISprite
    {
        public Enemy(DamageComponent damage, BodyComponent body, ISpriteComponent sprite)
        {
            Damage = damage;
            Body = body;
            Sprite = sprite;
        }

        public EnemyStateComponent State { get; } = new();
        public KineticComponent Kinetic { get; } = new();
        public DamageComponent Damage { get; }
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
    }

    public class EnemyStateComponent
    {
        public Vector2 Direction { get; set; } = Vector2.UnitX;
        public bool Dying { get; set; }
        public float DyingElapsed { get; set; }
    }
}