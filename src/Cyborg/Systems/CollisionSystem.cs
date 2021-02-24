using System;
using System.Collections.Generic;
using System.Linq;
using Cyborg.Components;
using Cyborg.Core;
using Cyborg.Utilities;
using Microsoft.Xna.Framework;

namespace Cyborg.Systems
{
    public class CollisionSystem : IUpdateSystem
    {
        private readonly IEntityManager _entityManager;
        private readonly IGameState _gameState;

        public CollisionSystem(IEntityManager entityManager, IGameState gameState)
        {
            _entityManager = entityManager;
            _gameState = gameState;
        }

        public void Update(GameTime gameTime)
        {
            if (!_gameState.Active)
                return;

            var collidableEntities = _entityManager.Entities<IBody>().Where(e => e.Body.Size != Point.Zero && e.Body.Edges > 0).ToList();

            // Resolve collisions
            foreach (var entity in _entityManager.Entities<IKinetic>())
                foreach (var otherEntity in collidableEntities)
                {
                    if (entity == otherEntity)
                        continue;

                    // Identify penetrations of faces
                    var penetrationVectors = GetPenetrationVectors(entity.Body.Bounds, entity.Body.Edges, otherEntity.Body.Bounds, otherEntity.Body.Edges).ToList();
                    if (!penetrationVectors.Any())
                        continue;

                    // Retract position by smallest penetration length
                    var smallestPenetratingVector = penetrationVectors.OrderBy(v => v.Length()).First();
                    entity.Body.Position -= smallestPenetratingVector;

                    if (otherEntity is IKinetic otherKineticEntity)
                    {
                        // Share momentum
                        var averageVelocity = (entity.Kinetic.Velocity + otherKineticEntity.Kinetic.Velocity) / 2; // TODO mass
                        entity.Kinetic.Velocity = averageVelocity;
                        otherKineticEntity.Kinetic.Velocity = averageVelocity;
                    }
                    else
                    {
                        // Reduce velocity based on penetration length
                        var velocityCoefficient = Vector2.Normalize(new Vector2(Math.Abs(smallestPenetratingVector.Y), Math.Abs(smallestPenetratingVector.X)));
                        entity.Kinetic.Velocity *= velocityCoefficient;
                    }
                }
        }

        // Direction of bounding box A penetrating into bounding box B, based on supported edges
        private static IEnumerable<Vector2> GetPenetrationVectors(Rectangle boxA, Edge edgesA, Rectangle boxB, Edge edgesB)
        {
            var intersection = Rectangle.Intersect(boxA, boxB);
            if (intersection.Width == 0 || intersection.Height == 0)
                yield break;

            // Calculate and return intersection depths.
            var centreA = new Vector2(boxA.Left + boxA.Width / 2, boxA.Top + boxA.Height / 2);
            var centreB = new Vector2(boxB.Left + boxB.Width / 2, boxB.Top + boxB.Height / 2);

            if (intersection.Width > 0 && edgesA.HasFlag(Edge.Right) && edgesB.HasFlag(Edge.Left) && centreA.X <= centreB.X)
                yield return new Vector2(intersection.Width, 0);

            if (intersection.Width > 0 && edgesA.HasFlag(Edge.Left) && edgesB.HasFlag(Edge.Right) && centreA.X > centreB.X)
                yield return new Vector2(-intersection.Width, 0);

            if (intersection.Height > 0 && edgesA.HasFlag(Edge.Bottom) && edgesB.HasFlag(Edge.Top) && centreA.Y <= centreB.Y)
                yield return new Vector2(0, intersection.Height);

            if (intersection.Height > 0 && edgesA.HasFlag(Edge.Top) && edgesB.HasFlag(Edge.Bottom) && centreA.Y > centreB.Y)
                yield return new Vector2(0, -intersection.Height);
        }
    }
}