using System.Linq;
using Cyborg.Components;
using Cyborg.ContentPipeline.Animations;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;

namespace Cyborg.Entities
{
    public class Zombie : IEnemy
    {
        public Zombie(ContentManager contentManager, Vector2 position)
        {
            var animationRoot = "Zombie/";
            var animationSet = contentManager.Load<AnimationSet>($"{animationRoot}animations");
            var animations = animationSet.ToDictionary(kvp => kvp.Key, kvp =>
            {
                var texture = contentManager.Load<Texture2D>($"{animationRoot}{kvp.Key}");
                return (texture, kvp.Value.FrameCount, kvp.Value.FrameRate, kvp.Value.Repeat);
            });
            Sprite = new AnimatedSpriteComponent(animations, new(0, -2), 3);
            Body.Position = position;
        }

        public EnemyComponent Enemy { get; } = new();
        public KineticComponent Kinetic { get; } = new();
        public DamageComponent Damage { get; } = new(3, 0.25f);
        public BodyComponent Body { get; } = new(Vector2.Zero, new(8, 12), Edge.Left | Edge.Top | Edge.Right | Edge.Bottom);
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
}