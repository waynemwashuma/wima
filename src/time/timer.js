const timerModeError = "`TimerMode` selected is not supported!"

export class Timer {
  
  /**
   * @type {TimerMode}
   */
  mode
  
  /**
   * @type {number}
   */
  elapsed = 0
  
  /**
   * @type {number}
   */
  duration = 0
  
  /**
   * @private
   * @type {boolean}
   */
  tick2 = false
  
  //TODO: Make private and rename to tick1
  /**
   * @type {boolean}
   */
  finished = false
  
  /**
   * @param {number} [duration=1]
   * @param {TimerMode} [mode=TimerMode.Once]
   */
  constructor(duration = 1, mode = TimerMode.Once) {
    this.duration = duration
    this.mode = mode
  }
  
  /**
   * @param {number} dt
   */
  update(dt) {
    Timer.update(this, dt)
  }
  reset() {
    Timer.reset(this)
  }
  
  /**
   * @returns {boolean}
   */
  tick() {
    switch (this.mode) {
      case TimerMode.Once:
        return this.finished && !this.tick2
      case TimerMode.Repeat:
        return this.finished
    }
  }
  
  /**
   * @returns {boolean}
   */
  completed() {
    switch (this.mode) {
      case TimerMode.Once:
        if (this.finished) {
          return true
        }
        return false
      case TimerMode.Repeat:
        return false
    }
  }
  
  /**
   * @param {Timer} timer
   * @param {number} dt
   */
  static update(timer, dt) {
    // if(timer.tick2) return
    if (timer.finished == true) {
      switch (timer.mode) {
        case TimerMode.Once:
          timer.tick2 = true
          break;
        case TimerMode.Repeat:
          break;
      }
    }
    timer.elapsed += dt
    timer.finished = false
    
    if (timer.elapsed >= timer.duration) {
      timer.finished = true
      
      if (timer.mode === TimerMode.Repeat) timer.elapsed = 0
    }
  }
  
  /**
   * @param {Timer} timer
   */
  static reset(timer) {
    timer.elapsed = 0
    timer.finished = false
    timer.tick2 = false
  }
}

/**
 * @readonly
 * @enum {number}
 */
export const TimerMode = {
  Once: 0,
  Repeat: 1
}