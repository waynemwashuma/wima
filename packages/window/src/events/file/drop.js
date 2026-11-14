/**
 * Captures the files supplied by a browser file-drop event.
 *
 * `path` references `DragEvent.dataTransfer.files`. When the event has no
 * data transfer or file list, the value is an empty `FileList`.
 *
 * @example
 * ```js
 * const drop = new FileDrop(event)
 * for (const file of drop.path) console.log(file.name)
 * ```
 */
export class FileDrop {

  /**
   * Files copied from `dataTransfer.files`, or an empty `FileList` when the
   * browser event does not provide a data transfer or files.
   *
   * @readonly
   * @type {FileList}
   */
  path

  /**
   * Copies the browser event's file list into `path`.
   *
   * @param {DragEvent} event - Browser file-drop event to capture.
   */
  constructor(event) {
    this.path = event.dataTransfer?.files || new FileList()
  }
}
