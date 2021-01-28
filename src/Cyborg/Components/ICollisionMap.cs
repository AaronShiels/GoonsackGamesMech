using Cyborg.Core;

namespace Cyborg.Components
{
    public interface ICollisionMap : IEntity
    {
        string CollisionMap { get; }
    }
}