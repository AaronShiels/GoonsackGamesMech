using Cyborg.Core;

namespace Cyborg.Components
{
    public class DamageComponent
    {
        private readonly float _invincibleDuration;

        public DamageComponent(int maximumDamage, float invincibleDuration)
        {
            Maximum = maximumDamage;
            _invincibleDuration = invincibleDuration;
        }

        public int Current { get; private set; }
        public int Maximum { get; }
        public int Remaining => Maximum - Current;
        public float Elapsed { get; set; }
        public bool Vulnerable => Elapsed > _invincibleDuration;

        public bool TryApply(int damage)
        {
            if (!Vulnerable)
                return false;

            Current += damage;
            Elapsed = 0f;
            return true;
        }
    }

    public interface IDamageable : IEntity
    {
        DamageComponent Damage { get; }
    }
}