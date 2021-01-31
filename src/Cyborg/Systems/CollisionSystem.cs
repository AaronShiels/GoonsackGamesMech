using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using Cyborg.Components;
using Cyborg.Core;
using Microsoft.Xna.Framework;

namespace Cyborg.Systems
{
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
                    var penetrationVector = GetPenetrationVector(kineticBoundingBox, staticBoundingBox);
                    if (penetrationVector == Vector2.Zero)
                        continue;

                    var normalVectors = GetNormalVectors(penetrationVector, kineticEntity.Edges, staticEntity.Edges);
                    if (!normalVectors.Any())
                        continue;

                    var smallestNormalVector = normalVectors.OrderBy(v => v.Length()).First();
                    kineticEntity.Position += smallestNormalVector;
                }
        }

        private static RectangleF GetBoundingBox(IBody bodyEntity) => new(bodyEntity.Position.X, bodyEntity.Position.Y, bodyEntity.Size.X, bodyEntity.Size.Y);

        // Direction of bounding box A penetrating into bounding box B
        private static Vector2 GetPenetrationVector(RectangleF boxA, RectangleF boxB)
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

            // If we are not intersecting at all, return (0, 0).
            if (Math.Abs(distanceX) >= minDistanceX || Math.Abs(distanceY) >= minDistanceY)
                return Vector2.Zero;

            // Calculate and return intersection depths.
            var depthX = distanceX > 0
                ? minDistanceX - distanceX
                : -minDistanceX - distanceX;
            var depthY = distanceY > 0
                ? minDistanceY - distanceY
                : -minDistanceY - distanceY;

            return new Vector2(depthX, depthY);
        }

        // Get all normal vectors that can be applied to penetration of A into B, based on edge definitions
        private static IEnumerable<Vector2> GetNormalVectors(Vector2 penetrationVector, Edge edgesA, Edge edgesB)
        {
            var rightPenetration = penetrationVector.X > 0 && edgesA.HasFlag(Edge.Right) && edgesB.HasFlag(Edge.Left);
            var leftPenetration = penetrationVector.X < 0 && edgesA.HasFlag(Edge.Left) && edgesB.HasFlag(Edge.Right);
            var bottomPenetration = penetrationVector.Y > 0 && edgesA.HasFlag(Edge.Bottom) && edgesB.HasFlag(Edge.Top);
            var topPenetration = penetrationVector.Y < 0 && edgesA.HasFlag(Edge.Top) && edgesB.HasFlag(Edge.Bottom);

            if (rightPenetration || leftPenetration)
                yield return new Vector2(-penetrationVector.X, 0);

            if (bottomPenetration || topPenetration)
                yield return new Vector2(0, -penetrationVector.Y);
        }
    }
}