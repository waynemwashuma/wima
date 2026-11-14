/**
 * WebGL 2 fragment-shader source for a basic textured-material pipeline.
 *
 * The shader expects `v_uv` and `v_color` varyings, a `WebglBasicMaterial`
 * block containing `enable_vertex_color`, `opacity`, and `color`, and the
 * `main_texture` sampler. It starts with `material.color`; when
 * `enable_vertex_color` is true, it multiplies that color by `v_color` before
 * writing `output_color`.
 *
 * The source still samples `main_texture`, but the sampled value and
 * `opacity` are not used in the output. Compile it with
 * {@linkcode createProgramFromSrc} alongside a vertex stage that provides
 * matching `v_uv` and `v_color` outputs, then bind the declared uniform block
 * and sampler names.
 *
 * @type {string}
 */
export const basicFragment =
  `#version 300 es
// When i figure out how to make bitflags work in webgl.
// const uint VERTEX_COLOR_FLAG = uint(1);
// const uint TRANSPARENT_FLAG = uint(2);

precision mediump float;

in vec2 v_uv;
in vec4 v_color;

uniform WebglBasicMaterial {
  bool enable_vertex_color;
  float opacity;
  vec4 color;
} material;
uniform sampler2D main_texture;

out vec4 output_color;

void main(){
  vec4 sampled_color = texture(main_texture,v_uv);
  vec4 base_color = material.color;
   
  if(material.enable_vertex_color){
    base_color *= v_color;
  }
  
  output_color = base_color;
}
`
