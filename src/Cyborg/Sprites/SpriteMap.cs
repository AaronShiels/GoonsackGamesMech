using Cyborg.ContentPipeline.Tiled;
using Microsoft.Xna.Framework.Graphics;

namespace Cyborg.Sprites
{
    public class SpriteMap
    {
        private readonly MapDefinition _mapDefinition;
        private readonly Texture2D _tileSetTexture;

        public SpriteMap(MapDefinition mapDefinition, Texture2D tileSetTexture)
        {
            _mapDefinition = mapDefinition;
            _tileSetTexture = tileSetTexture;
        }

        public MapDefinition Definition => _mapDefinition;
        public Texture2D Texture => _tileSetTexture;
    }
}