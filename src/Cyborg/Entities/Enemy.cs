using Cyborg.Components;

namespace Cyborg.Entities
{
    public class Enemy : IState<EnemyStateComponent>, IKinetic, ISprite
    {
        public Enemy(ISpriteComponent sprite, BodyComponent body, KineticComponent kinetic)
        {
            Sprite = sprite;
            Body = body;
            Kinetic = kinetic;
        }

        public EnemyStateComponent State { get; } = new EnemyStateComponent();
        public KineticComponent Kinetic { get; }
        public BodyComponent Body { get; }
        public ISpriteComponent Sprite { get; }
        public bool Destroyed { get; set; }

    }

    public class EnemyStateComponent
    {

    }
}