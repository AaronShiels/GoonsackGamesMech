using System.Collections.Generic;
using Microsoft.Xna.Framework;

namespace Cyborg.Core
{
    public interface IDrawSystem
    {
        void Draw(IEnumerable<IEntity> entities, GameTime gameTime);
    }
}