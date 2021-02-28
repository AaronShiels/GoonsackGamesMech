using Microsoft.Xna.Framework;

namespace Cyborg.Components
{
    public class EnemyComponent
    {
        public Vector2 Direction { get; set; } = Vector2.UnitX;

        public bool Walking { get; set; }

        public bool Dying { get; set; }
        public float DyingElapsed { get; set; }
    }

    public interface IEnemy : IKinetic, IDamageable, ISprite
    {
        EnemyComponent Enemy { get; }
    }
}