import * as THREE from "three";

// Utils to simplify work, etc.

const debounce = (fn, ms) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
};

/**
 * The three.js to work needs tree components that are renderer, camera and the scene.
 *
 * Here is the base setup for this:
 */

const w = window.innerWidth;
const h = window.innerHeight;

const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(w, h);

document.body.appendChild(renderer.domElement);

const fov = 75;
const aspect = w / h;
const near = 0.1;
const far = 10;

const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2;

const scene = new THREE.Scene();

// Render some pre defined geometry

const geo = new THREE.IcosahedronGeometry(1.0, 2);

const mat = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  flatShading: true,
});
const mesh = new THREE.Mesh(geo, mat);
scene.add(mesh);

const wireMat = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  wireframe: true,
});
const wireMesh = new THREE.Mesh(geo, wireMat);
wireMesh.scale.setScalar(1.001)
scene.add(wireMesh);

// Render some lights
const hemLight = new THREE.HemisphereLight(0xffffff, 0x000000);
scene.add(hemLight);

const animate = (t = 0) => {
  requestAnimationFrame(animate);
  geo.rotateY(0.001);
  renderer.render(scene, camera);
};

animate();