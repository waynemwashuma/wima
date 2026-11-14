/**
 * Built-in WebGL 2 vertex-shader source for a 3D {@linkcode BasicMaterial} pass.
 *
 * The shader expects a mesh's `position3d` attribute, a `Camera` uniform block
 * with `view` and `projection` matrices, and a separate `model` matrix. It
 * writes clip-space position with
 * `camera.projection * camera.view * model`. It declares no varyings and does
 * not perform lighting or material-color work.
 *
 * Pass this source as the `vertex3d` option of {@linkcode WebglMaterialPlugin}
 * and pair it with {@linkcode basicMaterial3DFragment} as the `fragment3d`
 * source.
 *
 * @type {string}
 */
export const basicMaterial3DVertex =
  `#version 300 es
#pragma vscode_glsllint_stage: vert
precision mediump float;

in vec3 position3d;

uniform Camera {
  mat4 view;
  mat4 projection;
} camera;
uniform mat4 model;

void main(){
  gl_Position = camera.projection * camera.view * model * vec4(position3d,1.0);
}
`

/**
 * Built-in WebGL 2 fragment-shader source for a 3D {@linkcode BasicMaterial} pass.
 *
 * The shader expects a `BasicMaterial` uniform block with a `color` value and
 * writes `output_color`. It preserves the material RGB values but always sets
 * the output alpha to `1.0`; it has no texture input, lighting, or varyings.
 *
 * Pass this source as the `fragment3d` option of {@linkcode WebglMaterialPlugin}
 * and pair it with {@linkcode basicMaterial3DVertex} as the `vertex3d` source.
 *
 * @type {string}
 */
export const basicMaterial3DFragment =
  `#version 300 es
#pragma vscode_glsllint_stage: frag
precision mediump float;

uniform BasicMaterial {
  vec4 color;
} material;

out vec4 output_color;

void main(){
  vec4 base_color = material.color;
  
  output_color = vec4(base_color.rgb,1.0);
}
`
