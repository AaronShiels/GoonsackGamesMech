using Cyborg.Components;
using Cyborg.ContentPipeline;
using Cyborg.Sprites;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;

namespace Cyborg.Entities
{
    public class Area : ISpriteMap
    {
        private readonly SpriteMapContainer _spriteMap;

        public Area(ContentManager contentManager)
        {
            _spriteMap = CreateSpriteMap(contentManager);
        }

        public SpriteMapContainer SpriteMapContainer => _spriteMap;
        public Vector2 Position { get; set; } = Vector2.Zero;
        public Vector2 Size { get; set; } = new Vector2(320, 176);
        public bool Destroyed { get; set; }

        private SpriteMapContainer CreateSpriteMap(ContentManager contentManager)
        {
            var mapDefinition = contentManager.Load<SpriteMap>("demo_map");
            var tileSetTexture = contentManager.Load<Texture2D>(mapDefinition.TileSet.Resource);

            return new SpriteMapContainer(mapDefinition, tileSetTexture);
        }
    }
}