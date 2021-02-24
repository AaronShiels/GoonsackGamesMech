using System.Linq;
using Cyborg.Components;
using Cyborg.ContentPipeline.Animations;
using Cyborg.Core;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace Cyborg.Entities
{
    public class Enemy : IState<EnemyStateComponent>, IKinetic, IDamageable, ISprite
    {
        private Enemy(DamageComponent damage, BodyComponent body, ISpriteComponent sprite)
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

        public static EntityConstructor<Enemy> Constructor(int initialX, int initialY)
            => contentManager =>
            {
                var animationRoot = "Zombie/";
                var animationSet = contentManager.Load<AnimationSet>($"{animationRoot}animations");
                var animations = animationSet.ToDictionary(kvp => kvp.Key, kvp =>
                {
                    var texture = contentManager.Load<Texture2D>($"{animationRoot}{kvp.Key}");
                    return (texture, kvp.Value.FrameCount, kvp.Value.FrameRate, kvp.Value.Repeat);
                });
                var sprite = new AnimatedSpriteComponent(animations, new(0, -2), 3);

                var position = new Vector2(initialX, initialY);
                var size = new Point(8, 12);
                var body = new BodyComponent(position, size, Edge.Left | Edge.Top | Edge.Right | Edge.Bottom);

                var damage = new DamageComponent(3, 0.25f);

                return new Enemy(damage, body, sprite);
            };
    }

    public class EnemyStateComponent
    {
        public Vector2 Direction { get; set; } = Vector2.UnitX;
        public bool Dying { get; set; }
        public float DyingElapsed { get; set; }
    }
}