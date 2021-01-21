using Microsoft.Xna.Framework;

namespace Cyborg.Core
{
    public interface IWorld
    {
        void Update(GameTime gameTime);
        void Draw(GameTime gameTime);
    }
}