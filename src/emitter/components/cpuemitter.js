import { Range } from '../../datastructures/index.js';

export class CPUEmitter {
 // replace with handle to a scene in the future
 /**
  * @type {()=>unknown[] | undefined}
  */
 prefab
 /**
  * @type {Range}
  */
 burstCount
 /**
  * @type {boolean}
  */
 enabled
 
 /**
  * @type {Range}
  */
 lifetime
 
 constructor({
  prefab,
  lifetime = new Range(),
  burstCount = new Range(1,1),
  enabled = true
 } = {}) {
  this.prefab = prefab
  this.lifetime = lifetime
  this.burstCount = burstCount
  this.enabled = enabled
 }
}