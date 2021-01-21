using System.Collections.Generic;

namespace Cyborg.Core
{
    public interface IEntityManager
    {
        TEntity Create<TEntity>() where TEntity : class, IEntity, new();
        IEnumerable<TEntity> Get<TEntity>() where TEntity : class, IEntity;
    }
}