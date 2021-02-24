using System.Linq;
using Cyborg.Components;
using Cyborg.ContentPipeline.Animations;
using Cyborg.Core;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace Cyborg.Entities
{
    public class Particle : IState<ParticleStateComponent>, IKinetic, ISprite
    {
        private Particle(ParticleStateComponent state, KineticComponent kinetic, BodyComponent body, AnimatedSpriteComponent sprite)
        {
            State = state;
            Kinetic = kinetic;
            Body = body;
            Sprite = sprite;
        }

        public ParticleStateComponent State { get; }
        public KineticComponent Kinetic { get; }
        public BodyComponent Body { get; }
        public ISpriteComponent Sprite { get; }
        public bool Destroyed { get; set; }

        // Animations
        public const string AnimationExplosion = "explosion";

        public static EntityConstructor<Particle> ExplosionConstructor(Vector2 initialPosition, Vector2 initialVelocity = default)
            => contentManager =>
            {
                var animationRoot = "Particles/";
                var animationSet = contentManager.Load<AnimationSet>($"{animationRoot}animations");
                var animations = animationSet.ToDictionary(kvp => kvp.Key, kvp =>
                {
                    var texture = contentManager.Load<Texture2D>($"{animationRoot}{kvp.Key}");
                    return (texture, kvp.Value.FrameCount, kvp.Value.FrameRate, kvp.Value.Repeat);
                });
                var sprite = new AnimatedSpriteComponent(animations, default, 4, Particle.AnimationExplosion);

                var body = new BodyComponent(initialPosition);
                var kinetic = new KineticComponent(1, initialVelocity);

                var state = new ParticleStateComponent(0.2f);

                return new Particle(state, kinetic, body, sprite);
            };
    }

    public class ParticleStateComponent
    {
        public ParticleStateComponent(float lifeSpan)
        {
            LifeSpan = lifeSpan;
        }

        public float LifeSpan { get; }
        public float Elapsed { get; set; }
        public bool Expired => Elapsed > LifeSpan;
    }
}