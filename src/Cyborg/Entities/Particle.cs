using Cyborg.Components;

namespace Cyborg.Entities
{
    public class Particle : IState<ParticleStateComponent>, IKinetic, ISprite
    {
        public Particle(ParticleStateComponent state, KineticComponent kinetic, BodyComponent body, AnimatedSpriteComponent sprite)
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