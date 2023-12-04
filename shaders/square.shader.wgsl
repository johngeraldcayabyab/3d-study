@vertex
fn vs(
  @builtin(vertex_index) VertexIndex : u32
) -> @builtin(position) vec4<f32> {
  var pos = array<vec2<f32>, 6>(
        vec2(-0.3, 0.3),
        vec2(0.3, 0.3),
        vec2(0.3, -0.3),
       vec2(-0.3, 0.3),
       vec2(0.3, -0.3),
       vec2(-0.3, -0.3),
  );
}

@fragment
fn fs() -> @location(0) vec4<f32> {
  return vec4(1.0, 0.0, 1.0, 1.0);
}