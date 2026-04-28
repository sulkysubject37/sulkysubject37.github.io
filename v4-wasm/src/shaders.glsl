@vs vs
layout(binding=0) uniform vs_params {
    mat4 mvp;
};
layout(location=0) in vec4 position;
layout(location=1) in vec2 texcoord0;
layout(location=2) in vec4 color0;
out vec2 uv;
out vec4 color;
void main() {
    gl_Position = mvp * position;
    uv = texcoord0;
    color = color0;
}
@end

@fs fs
layout(binding=0) uniform texture2D tex;
layout(binding=0) uniform sampler smp;
in vec2 uv;
in vec4 color;
out vec4 frag_color;
void main() {
    float distance = texture(sampler2D(tex, smp), uv).r;
    float smoothing = 0.1; // adjust for crispness
    float alpha = smoothstep(0.5 - smoothing, 0.5 + smoothing, distance);
    frag_color = vec4(color.rgb, color.a * alpha);
}
@end

@program sdf vs fs
