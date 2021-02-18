namespace Cyborg.Components
{
    public class EnemyComponent
    {

    }

    public interface IEnemy
    {
        EnemyComponent State { get; set; }
    }
}