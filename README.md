

# Three Course

Init with parcel

```
npm install
npx parcel index.html
```

## Shader Fragment & Vertex

In this.geometry = new THREE.PlaneBufferGeometry(1.5, 1.5, 100, 100);

The first 2 parameter ar the width and height of the plane, the last 2 instead are the point for side of the borders division point of the plane

### Usefull Noise functions shader 

Vertex

[https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83](https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83)

Sine Function

```
newposition.z += 0.1*sin((newposition.x + 0.25) * 2. * PI);
```

With this function we can obtain the only the first quarter of the curve inside a complete sine weave between 0 and 1 

```
varying float vNoise;
```

Varying variables are used to pass a parameter between vertex and fragment shader. The convention is to named the variables with lower v before the real name.

```
varying vec2 vUv;
```

This is a CPU 2 dimensional vector attribute that return all the cordinates of the shader. It starts from 0., 0. at left bottom anc arrives to 1. , 1. at right top like a cartesian plane whre the first parameter is the x and sencond the y.  


```
uniform sampler2D texture;
```

Sampler2D is a type of a uniform variable to import picture inside the shaders. To use it declare a vec4 and pass a function texture2D where the first 2 parameter is passed by the texture imported and the last 2 are passed from the voordinates vUv

```
vec4 textureVariable = texture2D(textureImported, vUv);
gl_FragColor = textureVariable;
```

When you pass a variyng attribute from vertex to fragment you have to consider that the GPU have to recalculate every vertex input for every pixel on the screen. So if the function in the vertex shader is complex it's better to declare the function inside the fragment shader and use it directly instead of pass it from the vUv

###Example

```
// vertex shader
varying float vNoise;
uniform float time;

function complexFunctionNoising(vec3 P) {
    ...
}

void main() {
    float noise = 0.3 * complexFunctionNoising(0.3, 0.4, time * 0.9);
    
    vNoise = noise;
}
```

Here the vNoise is passed from vertex shader and it is very impegnative for the GPU

```
// fragment shader

function complexFunctionNoising(vec3 P) {
    ...
}

void main() {
    float noise = 0.3 * complexFunctionNoising(0.3, 0.4, time * 0.9);

}
```

Here the function is declared inside the fragment shader and less hard to calculate for the GPU;