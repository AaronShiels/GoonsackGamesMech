using Cyborg.Components;

namespace Cyborg.Entities
{
    public class Enemy : IKinetic, IDamageable, ISprite
    {
        public Enemy(KineticComponent kinetic, DamageComponent damage, BodyComponent body, ISpriteComponent sprite)
        {
            Kinetic = kinetic;
            Damage = damage;
            Body = body;
            Sprite = sprite;
        }

        public KineticComponent Kinetic { get; }
        public DamageComponent Damage { get; }
        public BodyComponent Body { get; }
        public ISpriteComponent Sprite { get; }
        public bool Destroyed { get; set; }
    }
}