using Microsoft.Xna.Framework;

namespace Cyborg.Core
{
    public interface IEntity
    {
        bool Destroyed { get; set; }
    }
}