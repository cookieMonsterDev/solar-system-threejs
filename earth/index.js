import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";

import getStarfield from "./getStarfield.js";

// site for textures https://planetpixelemporium.com/planets.html

// Base earthMesh setup

const w = window.innerWidth;
const h = window.innerHeight;

const scene = new THREE.Scene();
const loader = new THREE.TextureLoader();
const renderer = new THREE.WebGLRenderer({ antialias: true });
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);

camera.position.z = 5;

renderer.setSize(w, h);

document.body.appendChild(renderer.domElement);

window.addEventListener("resize", () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
});

const earthGroup = new THREE.Group();
earthGroup.rotation.z = (-23.4 * Math.PI) / 180;

const geo = new THREE.IcosahedronGeometry(1, 12);
const mat = new THREE.MeshPhongMaterial({
  map: loader.load("./textures/earth-1.jpg"),
});
const earthMesh = new THREE.Mesh(geo, mat);
earthGroup.add(earthMesh);

// Starts

const stars = getStarfield();
scene.add(stars);

// People lights

const lightsMat = new THREE.MeshBasicMaterial({
  map: loader.load("./textures/earth-2.jpg"),
  blending: THREE.AdditiveBlending,
});
const lightsMesh = new THREE.Mesh(geo, lightsMat);
earthGroup.add(lightsMesh);

// Clouds

const cloudsMat = new THREE.MeshStandardMaterial({
  opacity: 0.3,
  transparent: true,
  blending: THREE.AdditiveBlending,
  map: loader.load("./textures/earth-clouds-1.jpg"),
  alphaMap: loader.load("./textures/earth-clouds-2.jpg"),
});
const cloudsMesh = new THREE.Mesh(geo, cloudsMat);
cloudsMesh.scale.setScalar(1.005);
earthGroup.add(cloudsMesh);

// Sun light

const sunLight = new THREE.DirectionalLight(0xffffff, 1);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight);

// OrbitControls

const controls = new OrbitControls(camera, renderer.domElement);

// Animation

scene.add(earthGroup);

const animate = (t = 0) => {
  requestAnimationFrame(animate);

  earthMesh.rotation.y += 0.001;
  lightsMesh.rotation.y += 0.001;
  cloudsMesh.rotation.y += 0.001;

  renderer.render(scene, camera);
  controls.update();
};

animate();
