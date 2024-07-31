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

// Front light

const sunLight = new THREE.DirectionalLight(0xffffff, 2);
sunLight.castShadow = true;
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight);

// Back light

const backLightMat = new THREE.MeshBasicMaterial({
  opacity: 0.3,
  map: loader.load("./textures/earth-2.jpg"),
  blending: THREE.AdditiveBlending,
});
const backLightMesh = new THREE.Mesh(geo, backLightMat);
earthGroup.add(backLightMesh);

// OrbitControls

const controls = new OrbitControls(camera, renderer.domElement);

// Animation

scene.add(earthGroup);

const animate = (t = 0) => {
  requestAnimationFrame(animate);

  earthMesh.rotation.y += 0.001;
  backLightMesh.rotation.y += 0.001;

  renderer.render(scene, camera);
  controls.update();
};

animate();
