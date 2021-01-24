using Cyborg.Components;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;
using MonoGame.Extended.Content;
using MonoGame.Extended.Serialization;
using MonoGame.Extended.Sprites;

namespace Cyborg.Entities
{
    public class Player : IPlayerControlled, IAnimatedSprite
    {
        private readonly AnimatedSprite _animatedSprite;

        public Player(ContentManager contentManager, JsonContentLoader jsonContentLoader)
        {
            _animatedSprite = new AnimatedSprite(contentManager.Load<SpriteSheet>($"player.sf", jsonContentLoader));
        }

        public float Mass => 1;
        public Vector2 Force { get; set; } = new Vector2(0, 0);
        public Vector2 Velocity { get; set; } = new Vector2(0, 0);
        public Vector2 Position { get; set; } = new Vector2(0, 0);
        public Vector2 Size { get; set; } = new Vector2(32, 32);
        public AnimatedSprite AnimatedSprite => _animatedSprite;
        public string CurrentAnimation { get; set; } = "walk_right";
        public bool Destroyed { get; set; }
    }
}