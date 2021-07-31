import { System } from ".";
import { BodyComponent, getBounds, hasBody, hasEdges, hasPhysics } from "../components";
import { add, divide, rectanglesIntersection, length, multiply, normalise, subtract, Vector, round } from "../utilities";

const collisionSystem: System = (game) => {
	if (!game.isServer) return;

	for (const entity of game.entities) {
		if (!hasPhysics(entity) || !hasBody(entity) || !hasEdges(entity)) continue;

		for (const otherEntity of game.entities) {
			if (!hasBody(otherEntity) || !hasEdges(otherEntity) || entity === otherEntity) continue;

			const penetrationVector = getShortestPenetrationVector(entity, otherEntity);
			if (!penetrationVector) continue;

			entity.position.x -= penetrationVector.x;
			entity.position.y -= penetrationVector.y;

			if (hasPhysics(otherEntity)) {
				const velocityAverage = divide(add(entity.velocity, otherEntity.velocity), 2);

				entity.velocity.x = velocityAverage.x;
				entity.velocity.y = velocityAverage.y;

				otherEntity.velocity.x = velocityAverage.x;
				otherEntity.velocity.y = velocityAverage.y;
			} else {
				const velocityModifier = normalise({ x: Math.abs(penetrationVector.y), y: Math.abs(penetrationVector.x) });
				entity.velocity.x *= velocityModifier.x;
				entity.velocity.y *= velocityModifier.y;
			}
		}
	}
};

const getShortestPenetrationVector = (entityA: BodyComponent, entityB: BodyComponent): Vector | undefined => {
	const entityBounds = getBounds(entityA);
	const otherEntityBounds = getBounds(entityB);
	const intersectionVector = rectanglesIntersection(entityBounds, otherEntityBounds);

	if (!intersectionVector) return;

	const penetrationVectors: Vector[] = [];
	if ((intersectionVector.x > 0 && entityA.edges.right && entityB.edges.left) || (intersectionVector.x < 0 && entityA.edges.left && entityB.edges.right))
		penetrationVectors.push({ ...intersectionVector, y: 0 });
	if ((intersectionVector.y > 0 && entityA.edges.bottom && entityB.edges.top) || (intersectionVector.y < 0 && entityA.edges.top && entityB.edges.bottom))
		penetrationVectors.push({ ...intersectionVector, x: 0 });

	const shortestPenetrationVector = penetrationVectors.sort((v1, v2) => length(v1) - length(v2))[0];
	return shortestPenetrationVector;
};

export { collisionSystem };
