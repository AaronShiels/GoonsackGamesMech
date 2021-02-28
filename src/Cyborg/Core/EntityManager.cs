using System;
using System.Collections.Generic;
using System.Linq;
using Cyborg.Utilities;
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

        public void Create(Func<ContentManager, IEntity> constructorFunc)
            => _entities.Add(constructorFunc(_contentManager));

        public void CreateMany(Func<ContentManager, IEnumerable<IEntity>> constructorFunc)
            => constructorFunc(_contentManager).ForEach(e => _entities.Add(e));

        public IEnumerable<TEntity> Entities<TEntity>() where TEntity : IEntity
            => _entities.OfType<TEntity>().ToList();

        public void Update(GameTime gameTime)
        {
            var destroyedEntites = _entities.Where(e => e.Destroyed).ToList();
            foreach (var destroyedEntity in destroyedEntites)
                _entities.Remove(destroyedEntity);
        }
    }
}