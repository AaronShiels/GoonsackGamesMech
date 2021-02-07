using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using Cyborg.Components;
using Cyborg.Core;
using Microsoft.Xna.Framework;

namespace Cyborg.Systems
{
    // TODO Support diagonals!
    public class CollisionSystem : IUpdateSystem
    {
        // TODO Quadtree probs
        private readonly IDictionary<IBody, RectangleF> _boundingBoxes = new Dictionary<IBody, RectangleF>();
        private readonly IReadOnlyCollection<IEntity> _entities;
        private readonly IGameState _gameState;

        public CollisionSystem(IReadOnlyCollection<IEntity> entities, IGameState gameState)
        {
            _entities = entities;
            _gameState = gameState;
        }

        public void Update(GameTime gameTime)
        {
            if (!_gameState.Active)
                return;

            var kineticEntities = _entities.OfType<IKinetic>();
            var solidEntities = _entities.OfType<IBody>().Where(e => e.Edges > 0);

            // Calculate bounding boxes
            _boundingBoxes.Clear();
            foreach (var entity in solidEntities)
                _boundingBoxes[entity] = new(entity.Position.X, entity.Position.Y, entity.Size.X, entity.Size.Y);

            // Resolve collisions
            foreach (var entity in kineticEntities)
                foreach (var otherEntity in solidEntities)
                {
                    if (entity == otherEntity)
                        continue;

                    // Identify penetrations of faces
                    var entityBoundingBox = _boundingBoxes[entity];
                    var otherEntityBoundingBox = _boundingBoxes[otherEntity];
                    var penetrationVectors = GetPenetrationVectors(entityBoundingBox, entity.Edges, otherEntityBoundingBox, otherEntity.Edges).ToList();
                    if (!penetrationVectors.Any())
                        continue;

                    // Retract position by smallest penetration length
                    var smallestPenetratingVector = penetrationVectors.OrderBy(v => v.Length()).First();
                    entity.Position -= smallestPenetratingVector;

                    // Reduce velocity based on penetration length
                    var velocityCoefficient = Vector2.Normalize(new Vector2(Math.Abs(smallestPenetratingVector.Y), Math.Abs(smallestPenetratingVector.X)));
                    entity.Velocity *= velocityCoefficient;

                    // Update bounding box for future calculations
                    _boundingBoxes[entity] = new(entity.Position.X, entity.Position.Y, entity.Size.X, entity.Size.Y);
                }
        }

        // Direction of bounding box A penetrating into bounding box B, based on supported edges
        private static IEnumerable<Vector2> GetPenetrationVectors(RectangleF boxA, Edge edgesA, RectangleF boxB, Edge edgesB)
        {
            var intersection = RectangleF.Intersect(boxA, boxB);
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