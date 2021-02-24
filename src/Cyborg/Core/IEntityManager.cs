using System.Collections.Generic;
using Microsoft.Xna.Framework.Content;

namespace Cyborg.Core
{
    public delegate TEntity EntityConstructor<TEntity>(ContentManager contentManager) where TEntity : IEntity;
    public delegate IEnumerable<TEntity> EntityGenerator<TEntity>(ContentManager contentManager) where TEntity : IEntity;

    public interface IEntityManager
    {
        IEnumerable<TEntity> Entities<TEntity>() where TEntity : IEntity;
        void Create<TEntity>(EntityConstructor<TEntity> constructor) where TEntity : IEntity;
        void Create<TEntity>(EntityGenerator<TEntity> constructor) where TEntity : IEntity;
    }
}