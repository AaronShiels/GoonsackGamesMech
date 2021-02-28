using Microsoft.Xna.Framework;

namespace Cyborg.Components
{
    public class PlayerComponent
    {
        public Vector2 Direction { get; set; } = Vector2.UnitX;

        public bool Walking { get; set; }

        public bool Attacking { get; set; }
        public float AttackElapsed { get; set; }
        public int AttackCounter { get; set; }
        public int AttackRadius => 18;
        public (double Minimum, double Maximum) AttackAngles { get; set; }

        public bool Dashing { get; set; }
        public float DashElapsed { get; set; }
    }

    public interface IPlayer : IControlled, IDamageable, IKinetic, ISprite
    {
        PlayerComponent Player { get; }
    }
}