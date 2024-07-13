out vec2 vUv;
uniform float uStageWidth; 
uniform float uWaveOffset; 
uniform float uAngle;
uniform float uAmplitude;
uniform float uInvert;

#define STAGE_SCALE_OFFSET 1.32

void main()
{
    vUv = uv;

    vec4 viewPos = modelViewMatrix * vec4( position, 1. );

    //4.0
    float angle = ((viewPos.x / (uStageWidth * STAGE_SCALE_OFFSET)) / 10.);
    float z = sin(angle * uAngle);
    float ratio = uWaveOffset - (viewPos.x * .5);

    float finalZ = (cos(z + ratio) * uAmplitude);

    if(uInvert == 1.) {
        viewPos.z += finalZ;
    }
    else{
        viewPos.z -= finalZ;
    }
    
    gl_Position = projectionMatrix * viewPos;
}