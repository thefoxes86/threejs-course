import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import fragment from "./shaders/fragment.glsl";
import vertex from "./shaders/vertex.glsl";
import ocean from "../img/ocean.jpg";
import imagesLoaded from "imagesloaded";
import gsap from "gsap";

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
      100,
      2000
    );
    this.camera.position.z = this.cameraZ;
    // The FOV is the angle in radius between the camera and the screen.
    this.camera.fov =
      2 * Math.atan(this.height / 2 / this.cameraZ) * (180 / Math.PI);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.images = [...document.querySelectorAll("img")];

    const imagesLoad = new Promise((resolve, reject) => {
      imagesLoaded(this.images, { backround: true }, resolve);
    });

    this.scrollPosition = 0;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    Promise.all([imagesLoad]).then(() => {
      this.addImages();
      this.setPosition();
      this.resize();
      this.onResize();
      // this.addObject();
      this.mouseMovement();
      this.render();

      window.addEventListener("scroll", (e) => {
        this.scrollPosition = window.scrollY;
        this.setPosition();
      });
    });
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
  }

  addImages() {
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        uTexture: { value: 0 },
        hover: { value: new THREE.Vector2(0.5, 0.5) },
        hoverState: { value: 0 },
      },
      fragmentShader: fragment,
      vertexShader: vertex,
      side: THREE.DoubleSide,
    });

    this.materials = [];
    this.imagesStore = this.images.map((img) => {
      let bounds = img.getBoundingClientRect();

      let geometry = new THREE.PlaneBufferGeometry(
        bounds.width,
        bounds.height,
        50,
        50
      );
      let texture = new THREE.Texture(img);
      texture.needsUpdate = true;
      // let material = new THREE.MeshBasicMaterial({
      //   map: texture,
      // });

      let material = this.material.clone();

      this.materials.push(material);

      img.addEventListener("mouseover", () => {
        gsap.to(material.uniforms.hoverState, { duration: 1, value: 1 });
      });

      img.addEventListener("mouseout", () => {
        gsap.to(material.uniforms.hoverState, { duration: 1, value: 0 });
      });

      material.uniforms.uTexture.value = texture;

      let mesh = new THREE.Mesh(geometry, material);

      this.scene.add(mesh);

      return {
        img: img,
        mesh: mesh,
        width: bounds.width,
        height: bounds.height,
        top: bounds.top,
        left: bounds.left,
      };
    });
  }

  setPosition() {
    this.imagesStore.forEach((o) => {
      o.mesh.position.y =
        this.scrollPosition - o.top + this.height / 2 - o.height / 2;
      o.mesh.position.x = o.left - this.width / 2 + o.width / 2;
    });
  }

  mouseMovement() {
    window.addEventListener("mousemove", (e) => {
      this.mouse.x = (event.clientX / this.width) * 2 - 1;
      this.mouse.y = -(event.clientY / this.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);

      // calculate objects intersecting the picking ray
      const intersects = this.raycaster.intersectObjects(this.scene.children);

      if (intersects.length > 0) {
        let obj = intersects[0].object;
        obj.material.uniforms.hover.value = intersects[0].uv;
      }
    });
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.camera.aspect = this.width / this.height;
    this.setPosition();
    this.renderer.setSize(this.width, this.height);
    this.camera.updateProjectionMatrix();
  }

  onResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  render() {
    this.time += 0.05;
    this.materials.forEach((m) => {
      m.uniforms.time.value = this.time;
    });
    // this.materials.uniforms.time.value = this.time;
    this.renderer.render(this.scene, this.camera);

    window.requestAnimationFrame(this.render.bind(this));
  }
}

new MainScene({
  dom: document.getElementById("container"),
});
