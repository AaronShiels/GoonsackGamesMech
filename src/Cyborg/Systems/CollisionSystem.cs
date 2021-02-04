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
            var solidEntities = _entities.OfType<IBody>();

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
                    var penetrationVectors = GetPenetrationVectors(_boundingBoxes[entity], entity.Edges, _boundingBoxes[otherEntity], otherEntity.Edges);
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
            var halfWidthA = boxA.Width / 2;
            var halfHeightA = boxA.Height / 2;
            var halfWidthB = boxB.Width / 2;
            var halfHeightB = boxB.Height / 2;

            var centreA = new Vector2(boxA.Left + halfWidthA, boxA.Top + halfHeightA);
            var centreB = new Vector2(boxB.Left + halfWidthB, boxB.Top + halfHeightB);

            var distanceX = centreB.X - centreA.X;
            var distanceY = centreB.Y - centreA.Y;
            var minDistanceX = halfWidthA + halfWidthB;
            var minDistanceY = halfHeightB + halfHeightB;

            // If we are not intersecting at all, return empty.
            if (Math.Abs(distanceX) >= minDistanceX || Math.Abs(distanceY) >= minDistanceY)
                yield break;

            // Calculate and return intersection depths.
            var penetrationX = distanceX > 0 ? minDistanceX - distanceX : -minDistanceX - distanceX;
            var penetrationY = distanceY > 0 ? minDistanceY - distanceY : -minDistanceY - distanceY;

            if ((edgesA.HasFlag(Edge.Right) && edgesB.HasFlag(Edge.Left)) || (edgesA.HasFlag(Edge.Left) && edgesB.HasFlag(Edge.Right)))
                yield return new Vector2(penetrationX, 0);

            if ((edgesA.HasFlag(Edge.Bottom) && edgesB.HasFlag(Edge.Top)) || (edgesA.HasFlag(Edge.Top) && edgesB.HasFlag(Edge.Bottom)))
                yield return new Vector2(0, penetrationY);
        }
    }
}