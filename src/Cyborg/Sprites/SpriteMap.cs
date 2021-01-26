using Cyborg.ContentPipeline;
using Microsoft.Xna.Framework.Graphics;

namespace Cyborg.Sprites
{
    public class SpriteMapContainer
    {
        private readonly SpriteMap _mapDefinition;
        private readonly Texture2D _tileSetTexture;

        public SpriteMapContainer(SpriteMap mapDefinition, Texture2D tileSetTexture)
        {
            _mapDefinition = mapDefinition;
            _tileSetTexture = tileSetTexture;
        }

        public SpriteMap Definition => _mapDefinition;
        public Texture2D Texture => _tileSetTexture;
    }
}