using System;
using Cyborg.Components;
using Cyborg.ContentPipeline;
using Cyborg.Core;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;

namespace Cyborg.Systems
{
    public class CollisionSystem : IUpdateSystem
    {
        private readonly ContentManager _contentManager;
        private readonly IEntityManager _entityManager;

        public CollisionSystem(ContentManager contentManager, IEntityManager entityManager)
        {
            _contentManager = contentManager;
            _entityManager = entityManager;
        }

        public void Update(GameTime gameTime)
        {
            var collidableEntities = _entityManager.Get<ICollidable>();
            var collisionMapEntities = _entityManager.Get<ICollisionMap>();

            foreach (var collidableEntity in collidableEntities)
            {
                var colliding = false;

                var collidableOffsetX = (int)collidableEntity.Position.X;
                var collidableOffsetY = (int)collidableEntity.Position.Y;
                var collidableBox = new Rectangle(collidableOffsetX, collidableOffsetY, collidableEntity.Size.X, collidableEntity.Size.Y);

                // Other collidables
                foreach (var otherEntity in collidableEntities)
                {
                    if (collidableEntity == otherEntity)
                        continue;

                    //var intersection = Rectangle.Intersection(collidable.BoundingBox, actor.BoundingBox);
                }

                // Collision map
                foreach (var collisionEntity in collisionMapEntities)
                {
                    var spriteMap = _contentManager.Load<SpriteMap>(collisionEntity.CollisionMap);

                    var collisionMapWidth = spriteMap.CollisionMap.GetLength(0);
                    var collisionMapHeight = spriteMap.CollisionMap.GetLength(1);

                    for (var x = 0; x < collisionMapWidth; x++)
                        for (var y = 0; y < collisionMapHeight; y++)
                        {
                            // Collidable if value > 0
                            if (spriteMap.CollisionMap[x, y] <= 0)
                                continue;

                            var collisionTileOffsetX = (int)collisionEntity.Position.X + x * spriteMap.TileWidth;
                            var collisionTileOffsetY = (int)collisionEntity.Position.Y + y * spriteMap.TileHeight;
                            var collisionTileBox = new Rectangle(collisionTileOffsetX, collisionTileOffsetY, spriteMap.TileWidth, spriteMap.TileHeight);

                            var intersection = Intersection(collidableBox, collisionTileBox);
                            if (!intersection.IsEmpty && !colliding)
                                colliding = true;
                        }
                }

                if (Debug.Enabled)
                    Debug.Add(collidableEntity, "Colliding", colliding.ToString());
            }
        }

        private static Rectangle Intersection(Rectangle first, Rectangle second)
        {
            var firstMinimum = first.Location;
            var firstMaximum = first.Location + first.Size;
            var secondMinimum = second.Location;
            var secondMaximum = second.Location + second.Size;

            var minimum = new Point(Math.Max(firstMinimum.X, secondMinimum.X), Math.Max(firstMinimum.Y, secondMinimum.Y));
            var maximum = new Point(Math.Min(firstMaximum.X, secondMaximum.X), Math.Min(firstMaximum.Y, secondMaximum.Y));

            if ((maximum.X < minimum.X) || (maximum.Y < minimum.Y))
                return Rectangle.Empty;
            else
                return new Rectangle(minimum, maximum - minimum);
        }
    }
}