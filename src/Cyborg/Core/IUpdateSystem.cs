using System.Collections.Generic;
using Microsoft.Xna.Framework;

namespace Cyborg.Core
{
    public interface IUpdateSystem
    {
        void Update(IEnumerable<IEntity> entities, GameTime gameTime);
    }
}