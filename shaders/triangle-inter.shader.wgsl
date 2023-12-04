struct OurVertexShaderOutput {
  @builtin(position) position: vec4f,
  @location(0) color: vec4f,
};

@vertex
fn vs(
  @builtin(vertex_index) VertexIndex : u32
) -> OurVertexShaderOutput {
  var pos = array<vec4<f32>, 3>(
    vec4(0.0, 0.3, 0.0, 1.0),
    vec4(-0.3, -0.3, 0.0, 1.0),
    vec4(0.3, -0.3, 0.0, 1.0)
  );

  var color = array<vec4f, 3>(
    vec4(1, 0, 0, 1),
    vec4(0, 1, 0, 1),
    vec4(0, 0, 1, 1),
  );

  var vsOutput: OurVertexShaderOutput;
  vsOutput.position = vec4f(pos[VertexIndex]);
  vsOutput.color = color[VertexIndex];
  return vsOutput;
}

@fragment
fn fs(fsInput: OurVertexShaderOutput) -> @location(0) vec4f {
  return fsInput.color;
}
