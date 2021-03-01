using System;
using System.Collections.Generic;
using Microsoft.Xna.Framework.Content;

namespace Cyborg.Core
{
    public interface IEntityManager
    {
        IEnumerable<TEntity> Entities<TEntity>() where TEntity : IEntity;
        TEntity Create<TEntity>(Func<ContentManager, TEntity> constructorFunc) where TEntity : IEntity;
        IEnumerable<IEntity> CreateMany(Func<ContentManager, IEnumerable<IEntity>> constructorFunc);
    }
}