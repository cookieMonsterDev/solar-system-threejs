import {
  Timer,
  Scene,
  AmbientLight,
  WebGLRenderer,
  PerspectiveCamera,
  SRGBColorSpace,
  ACESFilmicToneMapping,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { Sun } from "./sun";
import { Earth } from "./earth";
import { Planet } from "./planet";
import { Starfield } from "./starfield";
import { Simulation } from "./simulation";
import { TimeControls } from "./ui";
import { earthConfig, planetsConfig } from "./planets-config";

export class App {
  #scene;
  #camera;
  #renderer;
  #controls;
  #timer;
  #simulation;
  #bodies = [];

  constructor() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    this.#scene = new Scene();
    this.#camera = new PerspectiveCamera(75, w / h, 0.1, 100);
    this.#renderer = new WebGLRenderer({ antialias: true });
    this.#controls = new OrbitControls(this.#camera, this.#renderer.domElement);

    this.#timer = new Timer();
    this.#timer.connect(document);
    this.#simulation = new Simulation(this.#timer);

    this.#setupRenderer(w, h);
    this.#setupCamera();
    this.#setupControls();
    this.#setupScene();
    this.#setupBodies();
    this.#setupUI();
    this.#setupResize();
  }

  start() {
    this.#renderer.render(this.#scene, this.#camera);
    this.#animate();
  }

  #setupRenderer(w, h) {
    this.#renderer.setSize(w, h);
    this.#renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.#renderer.toneMapping = ACESFilmicToneMapping;
    this.#renderer.toneMappingExposure = 1.15;
    this.#renderer.outputColorSpace = SRGBColorSpace;
    document.body.appendChild(this.#renderer.domElement);
  }

  #setupCamera() {
    this.#camera.position.set(
      30 * Math.cos(Math.PI / 6),
      30 * Math.sin(Math.PI / 6),
      40
    );
  }

  #setupControls() {
    this.#controls.minDistance = 10;
    this.#controls.maxDistance = 60;
    this.#controls.enableDamping = true;
    this.#controls.dampingFactor = 0.05;
  }

  #setupScene() {
    // Soft fill so night sides stay readable after physical light falloff
    this.#scene.add(new AmbientLight(0xffffff, 0.55));
  }

  #setupBodies() {
    const sun = new Sun();
    const earth = new Earth(earthConfig);
    const starfield = new Starfield();
    const planets = planetsConfig.map((config) => new Planet(config));

    this.#bodies = [sun, earth, starfield, ...planets];

    for (const body of this.#bodies) {
      this.#scene.add(body.getObject3D());
    }
  }

  #setupUI() {
    new TimeControls(this.#simulation).mount();
  }

  #setupResize() {
    window.addEventListener("resize", () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      this.#renderer.setSize(width, height);
      this.#camera.aspect = width / height;
      this.#camera.updateProjectionMatrix();
    });
  }

  #animate = (timestamp) => {
    requestAnimationFrame(this.#animate);

    this.#timer.update(timestamp);
    const dt = this.#timer.getDelta();

    for (const body of this.#bodies) {
      body.update(dt);
    }

    this.#controls.update();
    this.#renderer.render(this.#scene, this.#camera);
  };
}
