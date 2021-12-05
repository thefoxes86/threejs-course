varying float vNoise;
varying vec2 vUv; 
uniform vec2 hover;
uniform float hoverState;
uniform sampler2D uTexture;
uniform sampler2D uTextureHover;
uniform float time;

void main() {
   
    vec3 color = vec3(hover, vNoise);

    vec4 newTexture = texture2D(uTexture, vUv);
    // gl_FragColor = vec4(finalColor,1.);
    vec2 newUV = vUv;
    vec2 p = newUV;
    float x = hoverState;
    x = smoothstep(.0,1.0,(x*2.0+p.y-1.0));
    vec4 f = mix(
        texture2D(uTexture, (p-.5)*(1.-x)+.5), 
        texture2D(uTextureHover, (p-.5)*x+.5), 
        x);
    gl_FragColor = f;

    // gl_FragColor.rgb += vec3(vNoise);
    // gl_FragColor = vec4(color, 1);
    
}