import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  LinearSRGBColorSpace,
  ACESFilmicToneMapping,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { Sun } from "./sun";
import { Planet } from "./planet";
import { Starfield } from "./starfield";

const planets = [
  {
    orbitSpeed: 0.00048,
    orbitRadius: 10,
    orbitRotationDirection: "clockwise",
    planetSize: 0.2,
    planetRotationSpeed: 0.005,
    planetRotationDirection: "counterclockwise",
    planetTexture: "/assets/mercury-map.jpg",
  },
  {
    orbitSpeed: 0.00035,
    orbitRadius: 13,
    orbitRotationDirection: "clockwise",
    planetSize: 0.5,
    planetRotationSpeed: 0.0005,
    planetRotationDirection: "clockwise",
    planetTexture: "/assets/venus-map.jpg",
  },
  {
    orbitSpeed: 0.00024,
    orbitRadius: 19,
    orbitRotationDirection: "clockwise",
    planetSize: 0.3,
    planetRotationSpeed: 0.01,
    planetRotationDirection: "counterclockwise",
    planetTexture: "/assets/mars-map.jpg",
  },
  {
    orbitSpeed: 0.00013,
    orbitRadius: 22,
    orbitRotationDirection: "clockwise",
    planetSize: 1,
    planetRotationSpeed: 0.06,
    planetRotationDirection: "counterclockwise",
    planetTexture: "/assets/jupiter-map.jpg",
  },
  {
    orbitSpeed: 0.0001,
    orbitRadius: 25,
    orbitRotationDirection: "clockwise",
    planetSize: 0.8,
    planetRotationSpeed: 0.05,
    planetRotationDirection: "counterclockwise",
    planetTexture: "/assets/saturn-map.jpg",
  },
  {
    orbitSpeed: 0.00007,
    orbitRadius: 28,
    orbitRotationDirection: "clockwise",
    planetSize: 0.5,
    planetRotationSpeed: 0.02,
    planetRotationDirection: "clockwise",
    planetTexture: "/assets/uranus-map.jpg",
  },
  {
    orbitSpeed: 0.000054,
    orbitRadius: 31,
    orbitRotationDirection: "clockwise",
    planetSize: 0.5,
    planetRotationSpeed: 0.02,
    planetRotationDirection: "counterclockwise",
    planetTexture: "/assets/neptune-map.jpg",
  },
];

const w = window.innerWidth;
const h = window.innerHeight;

const scene = new Scene();
const camera = new PerspectiveCamera(75, w / h, 0.1, 100);
const renderer = new WebGLRenderer();
const controls = new OrbitControls(camera, renderer.domElement);

controls.minDistance = 10;
controls.maxDistance = 60;
camera.position.set(30 * Math.cos(Math.PI / 6), 30 * Math.sin(Math.PI / 6), 40);

renderer.setSize(w, h);
renderer.toneMapping = ACESFilmicToneMapping;
renderer.outputColorSpace = LinearSRGBColorSpace;
document.body.appendChild(renderer.domElement);

const sun = new Sun().getSun();
scene.add(sun);

const starfield = new Starfield().getStarfield();
scene.add(starfield);

planets.forEach((item) => {
  const planet = new Planet(item).getPlanet();
  scene.add(planet);
});

renderer.render(scene, camera);

window.addEventListener("resize", () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
});

const animate = () => {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
};

animate();
