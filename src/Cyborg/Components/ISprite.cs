using Cyborg.Core;
using Microsoft.Xna.Framework;

namespace Cyborg.Components
{
    public interface ISprite : IEntity
    {
        string SpriteSheet { get; }
        Rectangle? SpriteFrame { get; set; }
        Point SpriteOffset { get; }
        int Order { get; }
    }
}