import { EntityHandle } from '@wimaengine/ecs'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Associates an entity with an animation player and an animation track key.
 *
 * `player` identifies the entity that owns {@linkcode AnimationPlayer}. `id`
 * identifies the corresponding track key in {@linkcode AnimationClip} for the
 * entity that owns this component.
 *
 * The component stores the player entity link and track key supplied to its
 * constructor. It does not validate that the entity is alive or that the key
 * exists in an animation clip.
 *
 * `serialize()` delegates the player field to `EntityHandle.serialize()`.
 * `deserialize()` delegates it to `EntityHandle.deserialize()`, so callers
 * should account for the different nested handle representations currently
 * used by those two helpers. `validateSerial()` checks the outer shape only;
 * it does not verify that the player handle identifies a live entity.
 *
 * @category component
 * @example
 * ```js
 * import { EntityHandle, Query, World } from '@wimaengine/ecs'
 * import { AnimationPlayer, AnimationTarget } from '@wimaengine/animation'
 *
 * const world = new World()
 * const player = world.spawn([new AnimationPlayer()])
 * const target = world.spawn([
 *   new AnimationTarget(player, 'opacity')
 * ])
 *
 * new Query(world, [EntityHandle, AnimationTarget]).each(([entity, animationTarget]) => {
 *   if (entity.equals(target)) {
 *     console.log(animationTarget.player.equals(player)) // true
 *     console.log(animationTarget.id) // 'opacity'
 *   }
 * })
 * ```
 */
export class AnimationTarget {

  /**
   * Entity handle for the entity that owns the {@linkcode AnimationPlayer} component.
   *
   * This is the handle supplied to the constructor or copied from another
   * target. Reading it does not query the world or confirm that the entity is
   * still alive.
   *
   * @type {EntityHandle}
   */
  player

  /**
   * Animation track key for this target.
   *
   * This is the string supplied to the constructor or copied from another
   * target. It identifies the track in the active {@linkcode AnimationClip} that
   * applies to this entity.
   *
   * @type {string}
   */
  id

  /**
   * Creates an animation target component.
   *
   * The supplied player handle and track key are stored directly. The
   * constructor does not validate the handle or look up the track key.
   *
   * @param {EntityHandle} player - Entity that owns the `AnimationPlayer` component.
   * @param {string} id - Key of the animation tracks to apply.
   */
  constructor(player, id) {
    this.player = player
    this.id = id
  }

  /**
   * Copies an animation target into another component.
   *
   * The `player` handle is assigned by reference and is not cloned. If `target`
   * is omitted, a new component is created and populated.
   *
   * @param {AnimationTarget} source - Target component to copy.
   * @param {AnimationTarget} [target=new AnimationTarget(source.player, source.id)] - Component to populate.
   * @returns {AnimationTarget} The populated target component.
   */
  static copy(source, target = new AnimationTarget(source.player, source.id)) {
    target.player = source.player
    target.id = source.id

    return target
  }

  /**
   * Creates a shallow copy of an animation target.
   *
   * The returned component has the same `id` and shares the source's
   * `EntityHandle` object because this method delegates to `copy()`.
   *
   * @param {AnimationTarget} target - Target component to clone.
   * @returns {AnimationTarget} A new target component.
   */
  static clone(target) {
    return AnimationTarget.copy(target)
  }

  /**
   * Converts an animation target to its serialized fields.
   *
   * The returned object contains `id` and the result of
   * `EntityHandle.serialize(value.player)` in `player`. That nested result is
   * the handle's `{index, generation}` object, not the packed numeric value
   * returned by `value.player.id()`.
   *
   * @param {AnimationTarget} value - Target component to serialize.
   * @returns {AnimationTargetSerial} Serialized target fields.
   */
  static serialize(value) {
    return {
      player: EntityHandle.serialize(value.player),
      id: value.id
    }
  }

  /**
   * Reconstructs an animation target from serialized fields.
   *
   * If `out` is supplied, its player handle is updated in place and its `id`
   * is replaced. Otherwise, a target with a placeholder handle is created.
   * The current implementation passes `value.player` to
   * `EntityHandle.deserialize()`, which expects a packed numeric entity id,
   * while `serialize()` currently writes the object returned by
   * `EntityHandle.serialize()`. Adapt the nested player value when restoring
   * the direct output of `serialize()`.
   *
   * @param {AnimationTargetSerial} value - Serialized target fields.
   * @param {AnimationTarget} [out] - Component to populate and return.
   * @returns {AnimationTarget} The populated target component.
   */
  static deserialize(value, out = new AnimationTarget(new EntityHandle(0, 0), '')) {
    out.player = EntityHandle.deserialize(value.player, out.player)
    out.id = value.id

    return out
  }

  /**
   * Checks the serialized shape accepted by an animation target.
   *
   * For a non-null object, validation requires a truthy `player` field and a
   * string `id` field. It does not validate the nested player representation,
   * check whether the handle is live in a world, or check that the id names a
   * track in an animation clip. The current implementation does not guard
   * against `null`, so callers should pass a non-null object.
   *
   * @param {unknown} value - Value to validate.
   * @returns {value is AnimationTargetSerial} Whether the outer shape is valid.
   */
  static validateSerial(value) {
    if (typeof value !== 'object') {
      return false
    }

    if (!('player' in value) || !('id' in value)) {
      return false
    }

    return !!value.player && typeof value.id === 'string'
  }
}

/**
 * Serialized form of `AnimationTarget`.
 *
 * @typedef AnimationTargetSerial
 * @property {any} player - Serialized player handle value.
 * @property {string} id - Animation track key.
 */
/* eslint-enable jsdoc/check-tag-names */
