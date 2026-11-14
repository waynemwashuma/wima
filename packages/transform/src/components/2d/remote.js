import { EntityHandle } from '@wimaengine/ecs'
import { Affine2 } from '@wimaengine/math'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Copies selected local 2D transform channels from a source entity to the
 * entity that owns this component.
 *
 * Add this component together with `Position2D`, `Orientation2D`, and
 * `Scale2D`. The `entity` handle identifies the source. Position, orientation,
 * and scale can be copied independently with the three `copy*` flags. All
 * three flags default to `true`, so a newly constructed component follows the
 * complete source transform.
 *
 * When the source handle is missing or stale, or the source does not have all
 * three local transform components, the target is left unchanged. The
 * `offsetTransform` is decomposed while the selected channels are copied. Its
 * translation is added to the source position, its orientation is combined
 * with the source orientation, and its scale is multiplied by the source
 * scale. The default `new Affine2()` is the identity transform, so it adds no
 * translation, rotation, or scale.
 *
 * Enable `RemoteTransform2DPlugin` to apply this component during the app's
 * transform updates.
 *
 * @category component
 * @example
 * ```js
 * import { World } from '@wimaengine/ecs'
 * import {
 *   Orientation2D,
 *   Position2D,
 *   RemoteTransform2D,
 *   Scale2D
 * } from '@wimaengine/transform'
 *
 * const world = new World()
 * const source = world.spawn([
 *   new Position2D(40, 20),
 *   new Orientation2D(),
 *   new Scale2D()
 * ])
 *
 * const remote = new RemoteTransform2D(source)
 * remote.copyOrientation = false
 * world.spawn([
 *   new Position2D(),
 *   new Orientation2D(),
 *   new Scale2D(),
 *   remote
 * ])
 *
 * // With RemoteTransform2DPlugin enabled, the follower copies the source's
 * // position and scale while retaining its own orientation.
 * ```
 */
export class RemoteTransform2D {

  /**
   * Whether the source's local position is copied to the target.
   *
   * When `false`, the target keeps its current local position.
   *
   * @defaultValue `true`
   * @type {boolean}
   */
  copyTranslation = true

  /**
   * Whether the source's local orientation is copied to the target.
   *
   * When `false`, the target keeps its current local orientation.
   *
   * @defaultValue `true`
   * @type {boolean}
   */
  copyOrientation = true

  /**
   * Whether the source's local scale is copied to the target.
   *
   * When `false`, the target keeps its current local scale.
   *
   * @defaultValue `true`
   * @type {boolean}
   */
  copyScale = true

  /**
   * Generation-aware handle of the source entity whose local 2D transform is
   * followed.
   *
   * The handle contains an entity slot index and generation. The generation
   * prevents a despawned entity's slot from accidentally referring to a later
   * entity that reuses the same slot.
   *
   * @type {EntityHandle}
   */
  entity

  /**
   * Affine offset applied to the copied transform channels.
   *
   * The value is decomposed whenever the transform is updated. Its translation
   * is added to a copied position, its orientation is combined with a copied
   * orientation, and its scale is multiplied by a copied scale. It starts as
   * the identity `Affine2`.
   *
   * @type {Affine2}
   */
  offsetTransform = new Affine2()

  /**
   * Creates a remote transform that follows `entity`.
   *
   * The copy flags start enabled and the offset starts as an identity affine.
   *
   * @param {EntityHandle} entity - Source entity handle.
   */
  constructor(entity) {
    this.entity = entity
  }

  /**
   * Copies all remote-transform settings into a component.
   *
   * The source handle is assigned to the target, while the offset affine is
   * copied into a new `Affine2` so later offset edits do not share the same
   * affine object.
   *
   * @param {RemoteTransform2D} source - Component to copy.
   * @param {RemoteTransform2D} [target=new RemoteTransform2D(source.entity)] -
   * Component to populate.
   * @returns {RemoteTransform2D} The populated target.
   */
  static copy(source, target = new RemoteTransform2D(source.entity)) {
    target.copyTranslation = source.copyTranslation
    target.copyOrientation = source.copyOrientation
    target.copyScale = source.copyScale
    target.entity = source.entity
    target.offsetTransform = Affine2.copy(source.offsetTransform, new Affine2())

    return target
  }

  /**
   * Creates a copy of a remote transform.
   *
   * @param {RemoteTransform2D} target - Component to clone.
   * @returns {RemoteTransform2D} The cloned component.
   */
  static clone(target) {
    return RemoteTransform2D.copy(target)
  }

  /**
   * Converts a remote transform to its serialized field representation.
   *
   * The three flags are written as booleans. The entity field is delegated to
   * `EntityHandle.serialize`, and the offset field is delegated to
   * `Affine2.serialize`.
   *
   * @param {RemoteTransform2D} value - Component to serialize.
   * @returns {RemoteTransform2DSerial} Serialized fields.
   */
  static serialize(value) {
    return {
      copyTranslation: value.copyTranslation,
      copyOrientation: value.copyOrientation,
      copyScale: value.copyScale,
      entity: EntityHandle.serialize(value.entity),
      offsetTransform: Affine2.serialize(value.offsetTransform)
    }
  }

  /**
   * Checks the shape and serialized values accepted by this component.
   *
   * Validation requires all three boolean flags, an entity value accepted by
   * `EntityHandle.validateSerial`, and a six-number affine value accepted by
   * `Affine2.validateSerial`. It checks representation only; it does not
   * verify that the entity is alive in a world.
   *
   * The entity serializer and validator currently use different
   * representations: `serialize()` writes the `{index, generation}` object
   * returned by `EntityHandle.serialize`, while this validator forwards its
   * input to `EntityHandle.validateSerial`, which accepts a packed numeric
   * entity ID.
   *
   * @param {unknown} value
   * @returns {value is RemoteTransform2DSerial} Whether `value` has the
   * required serialized shape.
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
      Affine2.validateSerial(value.offsetTransform)
  }

  /**
   * Reconstructs a remote transform from serialized fields.
   *
   * The flags are copied directly. The entity field is passed to
   * `EntityHandle.deserialize`, and the affine field is passed to
   * `Affine2.deserialize`; neither value is normalized by this method. If
   * `out` is provided, its entity and offset objects are updated in place. The
   * default output starts with a zero handle and an identity offset.
   *
   * @param {RemoteTransform2DSerial} value - Serialized fields. Its entity
   * value must satisfy the input contract of `EntityHandle.deserialize`.
   * @param {RemoteTransform2D} [out] - Optional component to populate.
   * @returns {RemoteTransform2D} The populated or newly created component.
   */
  static deserialize(value, out = new RemoteTransform2D(new EntityHandle(0, 0))) {
    out.copyTranslation = value.copyTranslation
    out.copyOrientation = value.copyOrientation
    out.copyScale = value.copyScale
    out.entity = EntityHandle.deserialize(value.entity, out.entity)
    out.offsetTransform = Affine2.deserialize(value.offsetTransform, out.offsetTransform)

    return out
  }
}

/**
 * Serialized form of `RemoteTransform2D`.
 *
 * @typedef RemoteTransform2DSerial
 * @property {boolean} copyTranslation
 * @property {boolean} copyOrientation
 * @property {boolean} copyScale
 * @property {any} entity - Entity value passed to the nested
 * `EntityHandle` serialization helpers.
 * @property {any} offsetTransform - Six-number affine value passed to the
 * nested `Affine2` serialization helpers.
 */

/* eslint-enable jsdoc/check-tag-names */
