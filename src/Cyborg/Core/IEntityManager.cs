using System;
using System.Collections.Generic;
using Microsoft.Xna.Framework.Content;

namespace Cyborg.Core
{
    public interface IEntityManager
    {
        IEnumerable<TEntity> Entities<TEntity>() where TEntity : IEntity;
        void Create(Func<ContentManager, IEntity> constructorFunc);
        void CreateMany(Func<ContentManager, IEnumerable<IEntity>> constructorFunc);
    }
}