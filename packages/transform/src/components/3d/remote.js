import { EntityHandle } from '@wimaengine/ecs'
import { Affine3 } from '@wimaengine/math'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Copies selected local 3D transform channels from a source entity to the
 * entity that owns this component.
 *
 * Add this component together with {@linkcode Position3D},
 * {@linkcode Orientation3D}, and {@linkcode Scale3D}. The `entity` handle identifies
 * the source by its slot index and generation. Selected channels copy the
 * source position, orientation, or scale, while disabled channels retain the
 * target's current local value. The source is skipped when its handle is stale,
 * its entity is missing, or its complete local transform is unavailable.
 *
 * The component also stores an `offsetTransform`, which defaults to the
 * identity {@linkcode Affine3}. The current implementation decomposes this
 * affine, but does not write the non-mutating arithmetic results back to the
 * target. Selected channels therefore receive the source values without a
 * translation, orientation, or scale offset.
 *
 * @category component
 *
 * @example
 * ```js
 * import { World } from '@wimaengine/ecs'
 * import {
 *   Orientation3D,
 *   Position3D,
 *   RemoteTransform3D,
 *   Scale3D
 * } from '@wimaengine/transform'
 *
 * const world = new World()
 * const source = world.spawn([
 *   new Position3D(3, 0, 0),
 *   new Orientation3D(),
 *   new Scale3D()
 * ])
 *
 * const follower = new RemoteTransform3D(source)
 * follower.copyScale = false
 * world.spawn([
 *   new Position3D(),
 *   new Orientation3D(),
 *   new Scale3D(),
 *   follower
 * ])
 *
 * // With RemoteTransform3DPlugin enabled, the follower follows the source's
 * // position and orientation while retaining its own local scale.
 * ```
 */
export class RemoteTransform3D {

  /**
   * Whether to copy the source's local position to the target.
   *
   * When `false`, the target keeps its current local position. The current
   * implementation copies the source position without applying an offset.
   *
   * @defaultValue `true`
   * @type {boolean}
   */
  copyTranslation = true

  /**
   * Whether to copy the source's local orientation to the target.
   *
   * When `false`, the target keeps its current local orientation. The current
   * implementation copies the source orientation without applying an offset.
   *
   * @defaultValue `true`
   * @type {boolean}
   */
  copyOrientation = true

  /**
   * Whether to copy the source's local scale to the target.
   *
   * When `false`, the target keeps its current local scale. The current
   * implementation copies the source scale without applying an offset.
   *
   * @defaultValue `true`
   * @type {boolean}
   */
  copyScale = true

  /**
   * Generation-aware handle for the source entity whose local transform is
   * followed. A stale handle does not follow a different entity that later
   * reuses the same slot.
   *
   * @type {EntityHandle}
   */
  entity

  /**
   * Affine offset stored with this component.
   *
   * It starts as the identity affine. The current implementation decomposes
   * it before processing selected channels, but does not write the resulting
   * non-mutating arithmetic values back to the target. Enabled channels
   * therefore receive source values without an offset.
   *
   * @type {Affine3}
   */
  offsetTransform = new Affine3()

  /**
   * Creates a remote transform that follows `entity`.
   *
   * @param {EntityHandle} entity - Generation-aware handle of the source entity.
   */
  constructor(entity) {
    this.entity = entity
  }

  /**
   * Copies a remote transform into an output component.
   *
   * The entity handle is assigned to the output, while `offsetTransform` is
   * copied into a new `Affine3`, so later offset changes do not share the
   * source affine object.
   *
   * @param {RemoteTransform3D} source - Remote transform to copy.
   * @param {RemoteTransform3D} [target=new RemoteTransform3D(source.entity)] - Component to populate.
   * @returns {RemoteTransform3D} The populated output component.
   */
  static copy(source, target = new RemoteTransform3D(source.entity)) {
    target.copyTranslation = source.copyTranslation
    target.copyOrientation = source.copyOrientation
    target.copyScale = source.copyScale
    target.entity = source.entity
    target.offsetTransform = Affine3.copy(source.offsetTransform, new Affine3())

    return target
  }

  /**
   * Creates an independent copy of a remote transform.
   *
   * @param {RemoteTransform3D} target - Remote transform to clone.
   * @returns {RemoteTransform3D} A new component with the same settings.
   */
  static clone(target) {
    return RemoteTransform3D.copy(target)
  }

  /**
   * Converts a remote transform to its serialized representation.
   *
   * The copy flags are written as booleans. The entity is delegated to
   * {@linkcode EntityHandle.serialize}, and the offset is delegated to
   * {@linkcode Affine3.serialize}.
   * The current serializer emits the entity value in the representation
   * returned by `EntityHandle.serialize`; validation and deserialization use
   * the representation accepted by `EntityHandle.validateSerial` and
   * `EntityHandle.deserialize`, so the serialized entity value is not
   * currently accepted by `validateSerial` as-is.
   *
   * @param {RemoteTransform3D} value - Remote transform to serialize.
   * @returns {RemoteTransform3DSerial} Serialized remote transform.
   */
  static serialize(value) {
    return {
      copyTranslation: value.copyTranslation,
      copyOrientation: value.copyOrientation,
      copyScale: value.copyScale,
      entity: EntityHandle.serialize(value.entity),
      offsetTransform: Affine3.serialize(value.offsetTransform)
    }
  }

  /**
   * Checks whether a value has the fields and primitive shapes expected by the
   * remote transform serializers.
   *
   * The three copy settings must be booleans. The entity and offset values are
   * checked with {@linkcode EntityHandle.validateSerial} and
   * {@linkcode Affine3.validateSerial}; this validates their serialized shapes,
   * not whether the referenced entity is currently alive in a world.
   *
   * @param {unknown} value
   * @returns {value is RemoteTransform3DSerial} Whether `value` is valid serialized data.
   */
  static validateSerial(value) {
    if (!value || typeof value !== 'object') {
      return false
    }

    if (!('copyTranslation' in value) ||
      !('copyOrientation' in value) ||
      !('copyScale' in value) ||
      !('entity' in value) ||
      !('offsetTransform' in value)
    ) {
      return false
    }

    return typeof value.copyTranslation === 'boolean' &&
      typeof value.copyOrientation === 'boolean' &&
      typeof value.copyScale === 'boolean' &&
      EntityHandle.validateSerial(value.entity) &&
      Affine3.validateSerial(value.offsetTransform)
  }

  /**
   * Reconstructs a remote transform from serialized values.
   *
   * The optional output component is updated in place. Its entity handle and
   * offset affine are also reused when their deserializers support an output
   * value. This method does not check the value first; call
   * {@linkcode RemoteTransform3D.validateSerial} when input may be untrusted.
   *
   * @param {RemoteTransform3DSerial} value - Serialized remote transform.
   * @param {RemoteTransform3D} [out=new RemoteTransform3D(new EntityHandle(0, 0))] - Component to populate.
   * @returns {RemoteTransform3D} The populated or newly created component.
   */
  static deserialize(value, out = new RemoteTransform3D(new EntityHandle(0, 0))) {
    out.copyTranslation = value.copyTranslation
    out.copyOrientation = value.copyOrientation
    out.copyScale = value.copyScale
    out.entity = EntityHandle.deserialize(value.entity, out.entity)
    out.offsetTransform = Affine3.deserialize(value.offsetTransform, out.offsetTransform)

    return out
  }
}

/* eslint-enable jsdoc/check-tag-names */

/**
 * Serialized form of `RemoteTransform3D`.
 *
 * @typedef RemoteTransform3DSerial
 * @property {boolean} copyTranslation
 * @property {boolean} copyOrientation
 * @property {boolean} copyScale
 * @property {any} entity - Value returned by `EntityHandle.serialize` and
 * passed to the nested entity-handle helpers.
 * @property {any} offsetTransform - Twelve affine matrix values returned by
 * `Affine3.serialize`.
 */
