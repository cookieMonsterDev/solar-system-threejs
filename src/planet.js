import {
  Mesh,
  Group,
  DoubleSide,
  AmbientLight,
  TorusGeometry,
  TextureLoader,
  MeshBasicMaterial,
  IcosahedronGeometry,
  MeshStandardMaterial,
} from "three";

export class Planet {
  #group;
  #loader;
  #planetMesh;
  #orbitMesh;
  #animate;

  constructor({
    orbitSpeed = 1,
    orbitRadius = 1,
    orbitRotationDirection = "clockwise",

    planetSize = 1,
    planetRotationSpeed = 1,
    planetRotationDirection = "clockwise",
    planetTexture = "/assets/mercury-map.jpg",
  }) {
    this.orbitSpeed = orbitSpeed;
    this.orbitRadius = orbitRadius;
    this.orbitRotationDirection = orbitRotationDirection;

    this.planetSize = planetSize;
    this.planetTexture = planetTexture;
    this.planetRotationSpeed = planetRotationSpeed;
    this.planetRotationDirection = planetRotationDirection;

    this.#group = new Group();
    this.#loader = new TextureLoader();

    this.#createOrbit();
    this.#createPlanet();

    this.#animate = this.#createAnimateFunction();
    this.#animate();
  }

  #createOrbit() {
    const orbitGeometry = new TorusGeometry(this.orbitRadius, 0.01, 100);
    const orbitMaterial = new MeshBasicMaterial({
      color: 0xadd8e6,
      side: DoubleSide,
    });
    this.#orbitMesh = new Mesh(orbitGeometry, orbitMaterial);
    this.#orbitMesh.rotation.x = (90 * Math.PI) / 180;
    this.#group.add(this.#orbitMesh);
  }

  #createPlanet() {
    const map = this.#loader.load(this.planetTexture);
    const planetGeometry = new IcosahedronGeometry(this.planetSize, 12);
    const planetMaterial = new MeshStandardMaterial({ map });
    this.#planetMesh = new Mesh(planetGeometry, planetMaterial);
    this.#planetMesh.position.x = this.orbitRadius - this.planetSize / 4;
    this.#group.add(this.#planetMesh);
  }

  #createAnimateFunction() {
    return () => {
      requestAnimationFrame(this.#animate);

      this.#updateOrbitRotation();
      this.#updatePlanetRotation();
    };
  }

  #updateOrbitRotation() {
    if (this.orbitRotationDirection === "clockwise") {
      this.#group.rotation.y -= this.orbitSpeed;
    } else if (this.orbitRotationDirection === "counterclockwise") {
      this.#group.rotation.y += this.orbitSpeed;
    }
  }

  #updatePlanetRotation() {
    if (this.planetRotationDirection === "clockwise") {
      this.#planetMesh.rotation.y -= this.planetRotationSpeed;
    } else if (this.planetRotationDirection === "counterclockwise") {
      this.#planetMesh.rotation.y += this.planetRotationSpeed;
    }
  }

  getPlanet() {
    return this.#group;
  }
}
