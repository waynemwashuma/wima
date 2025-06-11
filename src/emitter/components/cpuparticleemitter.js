export class ParticleEmitter {
  // replace with handle to a scene in the future
  /**
   * @type {()=>any[]}
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
   * @param {()=>any[]} prefab
   */
  constructor(prefab){
    this.prefab = prefab
  }
}