using System.Linq;
using Cyborg.Components;
using Cyborg.ContentPipeline.Animations;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;

namespace Cyborg.Entities
{
    public class Explosion : IParticle
    {
        public Explosion(ContentManager contentManager, Vector2 position)
        {
            var animationSet = contentManager.Load<AnimationSet>($"Particles/animations");
            var animations = animationSet.ToDictionary(kvp => kvp.Key, kvp =>
            {
                var texture = contentManager.Load<Texture2D>($"Particles/{kvp.Key}");
                return (texture, kvp.Value.FrameCount, kvp.Value.FrameRate, kvp.Value.Repeat);
            });
            Sprite = new AnimatedSpriteComponent(animations, default, 4, AnimationExplosion);
            Body.Position = position;
        }

        public ParticleComponent Particle { get; } = new ParticleComponent(0.2f);
        public BodyComponent Body { get; } = new();
        public ISpriteComponent Sprite { get; }
        public bool Destroyed { get; set; }

        // Animations
        public const string AnimationExplosion = "explosion";
    }
}