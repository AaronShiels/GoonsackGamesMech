using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Xna.Framework;

namespace Cyborg.Core
{
    public class EntityManager : IEntityManager, IUpdateSystem
    {
        private readonly IList<IEntity> _entities = new List<IEntity>();
        private readonly IServiceProvider _serviceProvider;

        public EntityManager(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public TEntity Create<TEntity>() where TEntity : class, IEntity
        {
            var entity = _serviceProvider.GetRequiredService<TEntity>();
            _entities.Add(entity);
            return entity;
        }

        public IEnumerable<TEntity> Get<TEntity>() where TEntity : class, IEntity
        {
            return _entities.OfType<TEntity>();
        }

        public void Remove<TEntity>(TEntity entity) where TEntity : class, IEntity
        {
            _entities.Remove(entity);
        }

        public void Update(GameTime gameTime)
        {
            for (var i = _entities.Count - 1; i >= 0; i--)
                if (_entities[i].Destroyed)
                    _entities.RemoveAt(i);
        }
    }
}