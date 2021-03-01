using Microsoft.Xna.Framework;

namespace Cyborg.Components
{
    public class EnemyComponent
    {
        public EnemyComponent(Vector2 direction = default)
        {
            Direction = direction != default ? direction : Vector2.UnitX;
        }

        public Vector2 Direction { get; set; }

        public bool Walking { get; set; }

        public bool Dying { get; set; }
        public float DyingElapsed { get; set; }
    }

    public interface IEnemy : IKinetic, IDamageable, ISprite
    {
        EnemyComponent Enemy { get; }
    }
}