using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;

namespace Cyborg.Core
{
    public class EntityManager : IEntityManager, IUpdateSystem
    {
        private readonly ContentManager _contentManager;
        private readonly IList<IEntity> _entities = new List<IEntity>();

        public EntityManager(ContentManager contentManager)
        {
            _contentManager = contentManager;
        }

        public TEntity Create<TEntity>(Func<ContentManager, TEntity> constructorFunc) where TEntity : IEntity
        {
            var entity = constructorFunc(_contentManager);
            _entities.Add(entity);

            return entity;
        }

        public IEnumerable<IEntity> CreateMany(Func<ContentManager, IEnumerable<IEntity>> constructorFunc)
        {
            var entities = constructorFunc(_contentManager).ToList();
            foreach (var entity in entities)
                _entities.Add(entity);

            return entities;
        }

        public IEnumerable<TEntity> Entities<TEntity>() where TEntity : IEntity => _entities.OfType<TEntity>().ToList();

        public void Update(GameTime gameTime)
        {
            var destroyedEntites = _entities.Where(e => e.Destroyed).ToList();
            foreach (var destroyedEntity in destroyedEntites)
                _entities.Remove(destroyedEntity);
        }
    }
}