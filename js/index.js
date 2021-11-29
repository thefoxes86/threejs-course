import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import fragment from "./shaders/fragment.glsl";
import vertex from "./shaders/vertex.glsl";
import ocean from "../img/ocean.jpg";

class MainScene {
  constructor(options) {
    this.container = options.dom;
    this.time = 0;

    this.scene = new THREE.Scene();

    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.cameraZ = 600;

    this.camera = new THREE.PerspectiveCamera(
      75,
      this.width / this.height,
      200,
      2000
    );

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.resize();
    this.onResize();
    this.addObject();
    this.mouseMovement();
    this.render();
  }

  addObject() {
    this.geometry = new THREE.PlaneBufferGeometry(
      this.width,
      this.height,
      30,
      30
    );
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: this.time },
        oTexture: { value: new THREE.TextureLoader().load(ocean) },
      },
      side: THREE.DoubleSide,
      vertexShader: vertex,
      fragmentShader: fragment,
      wireframe: true,
    });
    this.plane = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.plane);

    this.camera.position.z = this.cameraZ;

    // The FOV is the angle in radius between the camera and the screen.
    this.camera.fov = 2 * Math.tan(this.height / 2, this.cameraZ);
  }

  mouseMovement() {
    window.addEventListener("mousemove", (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.camera.aspect = this.width / this.height;
    this.renderer.setSize(this.width, this.height);
    this.camera.updateProjectionMatrix();
  }

  onResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  render() {
    this.time += 0.05;
    this.material.uniforms.time.value = this.time;
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.render.bind(this));
  }
}

new MainScene({
  dom: document.getElementById("container"),
});
