import { Interpolation } from '@wimaengine/math'

/**
 * Provides stateless deterministic noise sampling for repeatable procedural
 * values.
 *
 * A fixed seed makes samples reproducible: repeating the same numeric inputs
 * returns the same result, while changing the sampled input or seed selects a
 * different deterministic value.
 *
 * @example
 * const seed = 17
 * const first = Noise.get1D(12, seed)
 * const repeat = Noise.get1D(12, seed)
 * // first === repeat
 */
export class Noise {

  /**
   * Returns a deterministic pseudo-random value for one numeric input.
   *
   * `value` and `seed` are added before JavaScript's bitwise operations
   * coerce the sum to a signed 32-bit integer. The resulting integer is mixed
   * with a fixed polynomial hash, and its low 31 bits are mapped to a value
   * from `-1` (exclusive) through `1`. Fractional inputs therefore affect the
   * result only through the integer produced by that bitwise coercion.
   *
   * The function does not keep state: changing either argument changes the
   * deterministic sample when their summed 32-bit input changes. Different
   * arguments can collide when they produce the same coerced integer, while
   * repeating both arguments always returns the same number.
   *
   * @param {number} value - Input value to hash. It is added to `seed` before
   * 32-bit integer coercion.
   * @param {number} seed - Seed mixed into the input before hashing.
   * @returns {number} A deterministic noise value in `(-1, 1]`.
   *
   * @example
   * const sample = Noise.get1D(12, 17)
   * // sample === -0.4473929377272725
   */
  static get1D(value, seed) {
    const x = value + seed
    const y = BigInt((x << 13) ^ x)
    const z = (y * (y * y * 15731n + 789221n) + 1376312589n)
    const w = parseInt(z.toString(2).slice(-31), 2)

    return 1.0 - w / 1073741824
  }

  /**
   * Returns deterministic noise sampled from a two-dimensional coordinate.
   *
   * The coordinate is split into its floored cell (`intX`, `intY`) and its
   * fractional offsets (`tx`, `ty`). Four cell corners are sampled with
   * {@linkcode Noise.get1D} using the same seed and the integer sums
   * `intX + intY`, `intX + 1 + intY`, `intX + intY + 1`, and
   * `intX + 1 + intY + 1`. The first pair is blended with `tx`, the second pair
   * with `ty`, and those two results are blended with `ty` again. All three
   * blends use {@linkcode Interpolation.cosine}.
   *
   * Flooring makes negative coordinates sample the expected lower cell, so a
   * coordinate such as `-0.25` uses cell `-1` with a fractional offset of
   * `0.75`. The function is stateless and returns the same value for the same
   * coordinate and seed.
   *
   * @param {number} x - Horizontal coordinate to sample.
   * @param {number} y - Vertical coordinate to sample.
   * @param {number} seed - Seed passed to each corner sample.
   * @returns {number} The cosine-interpolated deterministic noise value.
   *
   * @example
   * const sample = Noise.get2D(2.25, 3.75, 17)
   * // sample === -0.4253525422191263
   */
  static get2D(x, y, seed) {
    const intX = Math.floor(x)
    const intY = Math.floor(y)

    const tx = x - intX
    const ty = y - intY

    const a = Noise.get1D(intX + intY, seed)
    const b = Noise.get1D(intX + 1 + intY, seed)
    const c = Noise.get1D(intX + intY + 1, seed)
    const d = Noise.get1D(intX + 1 + intY + 1, seed)

    return Interpolation.cosine(
      Interpolation.cosine(a, b, tx),
      Interpolation.cosine(c, d, ty),
      ty
    )
  }
}
