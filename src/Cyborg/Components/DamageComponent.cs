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

        public bool TryApply(int damage)
        {
            if (Elapsed < _invincibleDuration)
                return false;

            Current += damage;
            Elapsed = 0f;
            return true;
        }
    }

    public interface IDamageable
    {
        DamageComponent Damage { get; }
    }
}