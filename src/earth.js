import {
  Mesh,
  AdditiveBlending,
  MeshBasicMaterial,
  MeshStandardMaterial,
} from "three";
import { Planet } from "./planet";
import { assetUrl } from "./asset-url";

export class Earth extends Planet {
  constructor(props) {
    super(props);

    this.createPlanetLights();
    this.createPlanetClouds();
  }

  createPlanetLights() {
    const planetLightsMaterial = new MeshBasicMaterial({
      map: this.loader.load(assetUrl("assets/earth-map-2.jpg")),
      blending: AdditiveBlending,
    });
    const planetLightsMesh = new Mesh(
      this.planetGeometry,
      planetLightsMaterial
    );
    this.planetGroup.add(planetLightsMesh);
  }

  createPlanetClouds() {
    const planetCloudsMaterial = new MeshStandardMaterial({
      map: this.loader.load(assetUrl("assets/earth-map-3.jpg")),
      transparent: true,
      opacity: 0.8,
      blending: AdditiveBlending,
      alphaMap: this.loader.load(assetUrl("assets/earth-map-4.jpg")),
    });
    const planetCloudsMesh = new Mesh(
      this.planetGeometry,
      planetCloudsMaterial
    );
    planetCloudsMesh.scale.setScalar(1.003);
    this.cloudsMesh = planetCloudsMesh;
    this.planetGroup.add(planetCloudsMesh);
  }

  update(dt) {
    super.update(dt);
    if (this.cloudsMesh) {
      this.cloudsMesh.rotation.y += 0.002 * dt * 60;
    }
  }
}
