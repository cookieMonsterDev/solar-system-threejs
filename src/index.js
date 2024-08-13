import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  LinearSRGBColorSpace,
  ACESFilmicToneMapping,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { generateStarfield } from "./starfield";
import { sun, sunAnimation } from "./planets/sun";

import { Planet } from "./planets/planet";

const planets = [
  {
    orbitSpeed: 0.01,
    orbitRadius: 10,
    orbitRotationDirection: "clockwise",
    planetSize: 1,
    planetRotationSpeed: 0.01,
    planetRotationDirection: "clockwise",
    planetTexture: "/assets/mercury-map.jpg",
  },
];

const test = new Planet(planets[0]).getPlanet();

const w = window.innerWidth;
const h = window.innerHeight;

const scene = new Scene();
const camera = new PerspectiveCamera(75, w / h, 0.1, 1000);
const renderer = new WebGLRenderer();
const controls = new OrbitControls(camera, renderer.domElement);

camera.position.z = 5;
controls.minDistance = 2;
controls.maxDistance = 55;

renderer.setSize(w, h);
renderer.toneMapping = ACESFilmicToneMapping;
renderer.outputColorSpace = LinearSRGBColorSpace;
document.body.appendChild(renderer.domElement);

const starfield = generateStarfield();

scene.add(starfield);
// scene.add(sun);
scene.add(test);

renderer.render(scene, camera);

const animate = () => {
  requestAnimationFrame(animate);

  sunAnimation();
  // mercuryAnimation();

  starfield.rotation.y -= 0.0001;

  controls.update();
  renderer.render(scene, camera);
};

animate();

window.addEventListener("resize", () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
});
