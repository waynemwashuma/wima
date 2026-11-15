import { Query, World } from '@wimaengine/ecs'
import { Rotary } from '@wimaengine/math'
import { Position2D, Orientation2D, Scale2D, Position3D, Orientation3D, Scale3D, RemoteTransform2D, RemoteTransform3D } from '../components'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Copies selected local 2D transform channels from referenced entities.
 *
 * The source query requires {@linkcode Position2D}, {@linkcode Orientation2D}, and
 * {@linkcode Scale2D}. The target query requires those same components plus
 * {@linkcode RemoteTransform2D}. A target is skipped when its referenced entity
 * is missing, stale, or lacks the complete source transform. Otherwise the
 * system decomposes the remote offset and applies only the channels enabled by
 * {@linkcode RemoteTransform2D#copyTranslation},
 * {@linkcode RemoteTransform2D#copyOrientation}, and
 * {@linkcode RemoteTransform2D#copyScale}.
 *
 * For each enabled channel, the system applies the corresponding decomposed
 * offset: translation adds the offset position, orientation combines with the
 * offset orientation, and scale multiplies by the offset scale. Each selected
 * value is written into the target's local transform component.
 * The remote-transform plugin registers this function in the repeating Update
 * schedule.
 *
 * @param {World} world - World whose 2D remote transforms are updated.
 * @returns {void}
 * @category system
 */
export function transformRemote2D(world) {
  const transforms = new Query(world, [Position2D, Orientation2D, Scale2D])
  const remotes = new Query(world, [Position2D, Orientation2D, Scale2D, RemoteTransform2D])

  remotes.each(([position, orientation, scale, remote]) => {
    const entity = transforms.get(remote.entity)
    const [offPosition, offOrientation, offScale] = remote.offsetTransform.decompose()

    if (!entity) return

    if (remote.copyTranslation) {
      position.copy(entity[0]).add(offPosition)
    }
    if (remote.copyOrientation) {
      orientation.copy(Rotary.multiply(entity[1], offOrientation))
    }
    if (remote.copyScale) {
      scale.copy(entity[2]).multiply(offScale)
    }
  })
}

/**
 * Copies selected local 3D transform channels from referenced entities.
 *
 * The source query requires {@linkcode Position3D}, {@linkcode Orientation3D}, and
 * {@linkcode Scale3D}. The target query requires those same components plus
 * {@linkcode RemoteTransform3D}. A target is skipped when its referenced entity
 * is missing, stale, or lacks the complete source transform. Otherwise the
 * system decomposes the remote offset and checks
 * {@linkcode RemoteTransform3D#copyTranslation},
 * {@linkcode RemoteTransform3D#copyOrientation}, and
 * {@linkcode RemoteTransform3D#copyScale} before updating each selected channel.
 *
 * For each enabled channel, the system applies the corresponding decomposed
 * offset: translation adds the offset position, orientation combines with the
 * offset orientation, and scale multiplies by the offset scale. Each selected
 * value is written into the target's local transform component. The
 * remote-transform plugin registers this function in the repeating Update
 * schedule.
 *
 * @param {World} world - World whose 3D remote transforms are updated.
 * @returns {void}
 * @category system
 */
export function transformRemote3D(world) {
  const transforms = new Query(world, [Position3D, Orientation3D, Scale3D])
  const remotes = new Query(world, [Position3D, Orientation3D, Scale3D, RemoteTransform3D])

  remotes.each(([position, orientation, scale, remote]) => {
    const [offPosition, offOrientation, offScale] = remote.offsetTransform.decompose()

    const entity = transforms.get(remote.entity)

    if (!entity) return

    if (remote.copyTranslation) {
      position.copy(entity[0]).add(offPosition)
    }
    if (remote.copyOrientation) {
      orientation.copy(entity[1]).multiply(offOrientation)
    }
    if (remote.copyScale) {
      scale.copy(entity[2]).multiply(offScale)
    }
  })
}
/* eslint-enable jsdoc/check-tag-names */
