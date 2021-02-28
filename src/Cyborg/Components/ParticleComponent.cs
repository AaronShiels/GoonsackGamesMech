namespace Cyborg.Components
{
    public class ParticleComponent
    {
        public ParticleComponent(float lifeSpan)
        {
            LifeSpan = lifeSpan;
        }

        public float LifeSpan { get; }
        public float Elapsed { get; set; }
        public bool Expired => Elapsed > LifeSpan;
    }

    public interface IParticle : ISprite
    {
        ParticleComponent Particle { get; }
    }
}