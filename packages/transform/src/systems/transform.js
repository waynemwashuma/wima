import { EntityHandle, has, Query, without, World } from '@wimaengine/ecs'
import { Children, Parent } from '@wimaengine/hierarchy'
import { Affine2, Affine3 } from '@wimaengine/math'
import { RelationshipQuery } from '@wimaengine/relationship'
import { Position2D, Orientation2D, Scale2D, GlobalTransform2D, Position3D, Orientation3D, Scale3D, GlobalTransform3D } from '../components'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Synchronizes local 2D transform components into each entity's
 * {@linkcode GlobalTransform2D}.
 *
 * The query requires {@linkcode Position2D}, {@linkcode Orientation2D},
 * {@linkcode Scale2D}, and {@linkcode GlobalTransform2D} on the same entity. For
 * every match, {@linkcode GlobalTransform2D.compose} writes the local position,
 * orientation, and scale into the existing global transform. This system does
 * not traverse the hierarchy; use {@linkcode propagateTransform2D} for parent
 * propagation. The transform plugin registers it in the repeating Update
 * schedule before that propagation system.
 *
 * @param {World} world - World whose 2D transform entities are synchronized.
 * @returns {void}
 * @category system
 */
export function synctransform2D(world) {
  const query = new Query(world, [Position2D, Orientation2D, Scale2D, GlobalTransform2D])

  query.each(([position, orientation, scale, transform]) => {
    transform.compose(position, orientation, scale)
  })
}

/**
 * Synchronizes local 3D transform components into each entity's
 * {@linkcode GlobalTransform3D}.
 *
 * The query requires {@linkcode Position3D}, {@linkcode Orientation3D},
 * {@linkcode Scale3D}, and {@linkcode GlobalTransform3D} on the same entity. For
 * every match, {@linkcode GlobalTransform3D.compose} writes the local position,
 * orientation, and scale into the existing global transform. This system does
 * not traverse the hierarchy; use {@linkcode propagateTransform3D} for parent
 * propagation. The transform plugin registers it in the repeating Update
 * schedule before that propagation system.
 *
 * @param {World} world - World whose 3D transform entities are synchronized.
 * @returns {void}
 * @category system
 */
export function synctransform3D(world) {
  const query = new Query(world, [Position3D, Orientation3D, Scale3D, GlobalTransform3D])

  query.each(([position, orientation, scale, transform]) => {
    transform.compose(position, orientation, scale)
  })
}

/**
 * Propagates 2D global transforms through entity hierarchies.
 *
 * The root query starts at entities with {@linkcode EntityHandle} and
 * {@linkcode Children} that do not have {@linkcode Parent}. Each root is then
 * traversed breadth-first through the {@linkcode Children}/{@linkcode Parent}
 * relationship with {@linkcode GlobalTransform2D} data on both sides. For every
 * matched parent-child edge, the system multiplies the parent and child global
 * transforms with {@linkcode Affine2.multiply} and copies the result into the
 * child transform in place. The transform plugin registers this function in
 * the repeating Update schedule after 2D synchronization.
 *
 * @param {World} world - World whose 2D hierarchies are propagated.
 * @returns {void}
 * @category system
 */
export function propagateTransform2D(world) {
  const hierachyTransforms = new RelationshipQuery(world, Children, Parent, [GlobalTransform2D])
  const roots = new Query(world, [EntityHandle], [has(Children), without(Parent)])

  roots.each(([entity]) => {
    hierachyTransforms.treebfs(entity, ([childTransform], [parentTransform]) => {
      const finalTransform = Affine2.multiply(parentTransform, childTransform)

      childTransform.copy(finalTransform)
    })
  })
}

/**
 * Propagates 3D global transforms through entity hierarchies.
 *
 * The root query starts at entities with {@linkcode EntityHandle} and
 * {@linkcode Children} that do not have {@linkcode Parent}. Each root is then
 * traversed breadth-first through the {@linkcode Children}/{@linkcode Parent}
 * relationship with {@linkcode GlobalTransform3D} data on both sides. For every
 * matched parent-child edge, the system multiplies the parent and child global
 * transforms with {@linkcode Affine3.multiply} and copies the result into the
 * child transform in place. The transform plugin registers this function in
 * the repeating Update schedule after 3D synchronization.
 *
 * @param {World} world - World whose 3D hierarchies are propagated.
 * @returns {void}
 * @category system
 */
export function propagateTransform3D(world) {
  const hierachyTransforms = new RelationshipQuery(world, Children, Parent, [GlobalTransform3D])
  const roots = new Query(world, [EntityHandle], [has(Children), without(Parent)])

  roots.each(([entity]) => {
    hierachyTransforms.treebfs(entity, ([childTransform], [parentTransform]) => {
      const finalTransform = Affine3.multiply(parentTransform, childTransform)

      childTransform.copy(finalTransform)
    })
  })
}
/* eslint-enable jsdoc/check-tag-names */
