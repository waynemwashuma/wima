/**
 * WebGL 2 vertex-shader source for a basic-material pipeline.
 *
 * The shader expects `position3d`, `normal3d`, `uv`, and `color` attributes.
 * It transforms `position3d` with the `Camera` block's `view` and `projection`
 * matrices plus `model`, then forwards `uv` as `v_uv` and `color` as `v_color`
 * for a matching fragment stage such as {@linkcode basicFragment}. `normal3d` is
 * declared for the mesh interface but is not used.
 *
 * The `Camera` block contains `view` and `projection`. `model` is declared as
 * `mat3x4`, converted with `mat4(model)`, and transposed in the position
 * calculation. The source can be supplied as part of a custom
 * {@linkcode WebglMaterialPlugin} shader pair.
 *
 * @type {string}
 */
export const basicVertex =
  `#version 300 es
#pragma vscode_glsllint_stage: vert
precision mediump float;

in vec3 position3d;
in vec3 normal3d;
in vec2 uv;
in vec4 color;

uniform Camera {
  mat4 view;
  mat4 projection;
} camera;
uniform mat3x4 model;

out vec2 v_uv;
out vec4 v_color;

void main(){
  gl_Position = camera.projection * camera.view * transpose(mat4(model)) * vec4(position3d,1.0);
  v_uv = uv;
  v_color = color;
}
`
