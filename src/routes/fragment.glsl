precision highp float;

uniform vec3 uColor;

in vec2 vUv;
out vec4 outColor;


void main() {
    outColor = vec4(uColor, 1.);
}
