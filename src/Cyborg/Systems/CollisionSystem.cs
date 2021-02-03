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
        public void Update(IEnumerable<IEntity> entities, GameTime gameTime)
        {
            var kineticEntities = entities.OfType<IKinetic>();
            var staticEntities = entities.OfType<IBody>().Where(e => e is not IKinetic);

            foreach (var kineticEntity in kineticEntities)
                foreach (var staticEntity in staticEntities)
                {
                    var kineticBoundingBox = GetBoundingBox(kineticEntity);
                    var staticBoundingBox = GetBoundingBox(staticEntity);
                    var penetrationVectors = GetPenetrationVectors(kineticBoundingBox, kineticEntity.Edges, staticBoundingBox, staticEntity.Edges);
                    if (!penetrationVectors.Any())
                        continue;

                    var smallestPenetratingVector = penetrationVectors.OrderBy(v => v.Length()).First();
                    kineticEntity.Position -= smallestPenetratingVector;

                    var velocityCoefficient = Vector2.Normalize(new Vector2(Math.Abs(smallestPenetratingVector.Y), Math.Abs(smallestPenetratingVector.X)));
                    kineticEntity.Velocity *= velocityCoefficient;
                }
        }

        private static RectangleF GetBoundingBox(IBody bodyEntity) => new(bodyEntity.Position.X, bodyEntity.Position.Y, bodyEntity.Size.X, bodyEntity.Size.Y);

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