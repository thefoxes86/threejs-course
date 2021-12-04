varying float vNoise;
varying vec2 vUv; 
uniform vec2 hover;
uniform sampler2D uTexture;
uniform float time;

void main() {
   
    vec3 color = vec3(hover, vNoise);

    vec4 newTexture = texture2D(uTexture, vUv);
    // gl_FragColor = vec4(finalColor,1.);
    
    gl_FragColor = newTexture;
    // gl_FragColor.rgb += vec3(vNoise);
    // gl_FragColor = vec4(color, 1);
    
}