export class ParticleEmitter {
  // replace with handle to a scene in the future
  /**
   * @type {()=>unknown[] | undefined}
   */
  prefab
  /**
   * @type {number}
   */
  burstCount = 1
  /**
   * @type {boolean}
   */
  enabled = true
  /**
   * @param {()=>unknown[]} prefab
   */
  constructor(prefab) {
    this.prefab = prefab
  }
}