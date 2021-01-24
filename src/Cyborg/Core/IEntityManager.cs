using System.Collections.Generic;

namespace Cyborg.Core
{
    public interface IEntityManager
    {
        TEntity Create<TEntity>() where TEntity : class, IEntity;
        IEnumerable<TEntity> Get<TEntity>() where TEntity : class, IEntity;
    }
}