import {
  Mesh,
  Group,
  DoubleSide,
  RingGeometry,
  TorusGeometry,
  TextureLoader,
  SRGBColorSpace,
  MeshPhongMaterial,
  MeshBasicMaterial,
  IcosahedronGeometry,
} from "three";
import { CelestialBody } from "./celestial-body";
import { createFresnelMaterial } from "./fresnel-glow";
import { assetUrl } from "./asset-url";

function signedSpeed(speed, direction) {
  return direction === "counterclockwise" ? speed : -speed;
}

export class Planet extends CelestialBody {
  constructor({
    orbitSpeed = 1,
    orbitRadius = 1,
    orbitRotationDirection = "clockwise",

    planetSize = 1,
    planetAngle = 0,
    planetRotationSpeed = 1,
    planetRotationDirection = "clockwise",
    planetTexture = assetUrl("assets/mercury-map.jpg"),

    rimHex = 0x0088ff,
    facingHex = 0x000000,

    rings = null,
  } = {}) {
    super();

    this.orbitRadius = orbitRadius;
    this.orbitSpeed = signedSpeed(orbitSpeed, orbitRotationDirection);

    this.planetSize = planetSize;
    this.planetAngle = planetAngle;
    this.planetTexture = planetTexture;
    this.planetRotationSpeed = signedSpeed(
      planetRotationSpeed,
      planetRotationDirection
    );

    this.rings = rings;

    this.planetGroup = new Group();
    this.loader = new TextureLoader();
    this.planetGeometry = new IcosahedronGeometry(this.planetSize, 12);

    this.createOrbit();
    this.createRings();
    this.createPlanet();
    this.createGlow(rimHex, facingHex);
  }

  createOrbit() {
    const orbitGeometry = new TorusGeometry(this.orbitRadius, 0.01, 100);
    const orbitMaterial = new MeshBasicMaterial({
      color: 0xadd8e6,
      side: DoubleSide,
    });
    const orbitMesh = new Mesh(orbitGeometry, orbitMaterial);
    orbitMesh.rotation.x = Math.PI / 2;
    orbitMesh.name = "orbit";
    this.orbitMesh = orbitMesh;
    this.group.add(orbitMesh);
  }

  createPlanet() {
    const map = this.loader.load(this.planetTexture);
    const planetMaterial = new MeshPhongMaterial({ map });
    planetMaterial.map.colorSpace = SRGBColorSpace;
    const planetMesh = new Mesh(this.planetGeometry, planetMaterial);
    this.planetGroup.add(planetMesh);
    this.planetGroup.position.x = this.orbitRadius - this.planetSize / 9;
    this.planetGroup.rotation.z = this.planetAngle;
    this.group.add(this.planetGroup);
  }

  createGlow(rimHex, facingHex) {
    const planetGlowMaterial = createFresnelMaterial({
      color1: rimHex,
      color2: facingHex,
    });
    const planetGlowMesh = new Mesh(this.planetGeometry, planetGlowMaterial);
    planetGlowMesh.scale.setScalar(1.1);
    this.planetGroup.add(planetGlowMesh);
  }

  createRings() {
    if (!this.rings) return;

    const innerRadius = this.planetSize + 0.1;
    const outerRadius = innerRadius + this.rings.ringsSize;

    const ringsGeometry = new RingGeometry(innerRadius, outerRadius, 64);

    const ringsMaterial = new MeshBasicMaterial({
      side: DoubleSide,
      transparent: true,
      map: this.loader.load(this.rings.ringsTexture),
    });

    const ringMeshs = new Mesh(ringsGeometry, ringsMaterial);
    ringMeshs.rotation.x = Math.PI / 2;
    this.planetGroup.add(ringMeshs);
  }

  setOrbitVisible(visible) {
    if (this.orbitMesh) this.orbitMesh.visible = visible;
  }

  update(dt) {
    const step = dt * 60;
    this.group.rotation.y += this.orbitSpeed * step;
    this.planetGroup.rotation.y += this.planetRotationSpeed * step;
  }
}
