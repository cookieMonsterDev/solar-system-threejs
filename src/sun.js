import {
  Mesh,
  Vector3,
  BackSide,
  PointLight,
  TextureLoader,
  SRGBColorSpace,
  DynamicDrawUsage,
  MeshBasicMaterial,
  IcosahedronGeometry,
} from "three";
import { ImprovedNoise } from "three/addons/math/ImprovedNoise.js";
import { CelestialBody } from "./celestial-body";
import { createFresnelMaterial } from "./fresnel-glow";
import { assetUrl } from "./asset-url";

export class Sun extends CelestialBody {
  elapsed = 0;

  constructor() {
    super();

    this.sunTexture = assetUrl("assets/sun-map.jpg");
    this.loader = new TextureLoader();

    this.createCorona();
    this.createRim();
    this.addLighting();
    this.createGlow();
    this.createSun();
  }

  createSun() {
    const map = this.loader.load(this.sunTexture);
    map.colorSpace = SRGBColorSpace;
    const sunGeometry = new IcosahedronGeometry(5, 12);
    const sunMaterial = new MeshBasicMaterial({
      map,
      // Keep the sun bright under ACES — it's the scene light source
      toneMapped: false,
    });
    const sunMesh = new Mesh(sunGeometry, sunMaterial);
    this.group.add(sunMesh);

    this.group.add(this.sunRim);
    this.group.add(this.corona);
    this.group.add(this.glow);
  }

  createCorona() {
    const coronaGeometry = new IcosahedronGeometry(4.9, 12);
    const coronaMaterial = new MeshBasicMaterial({
      color: 0xff0000,
      side: BackSide,
    });
    const coronaMesh = new Mesh(coronaGeometry, coronaMaterial);
    const coronaNoise = new ImprovedNoise();

    const v3 = new Vector3();
    const p = new Vector3();
    const pos = coronaGeometry.attributes.position;
    pos.usage = DynamicDrawUsage;
    const len = pos.count;

    const update = (t) => {
      for (let i = 0; i < len; i += 1) {
        p.fromBufferAttribute(pos, i).normalize();
        v3.copy(p).multiplyScalar(5);
        const ns = coronaNoise.noise(
          v3.x + Math.cos(t),
          v3.y + Math.sin(t),
          v3.z + t
        );
        v3.copy(p)
          .setLength(5)
          .addScaledVector(p, ns * 0.4);
        pos.setXYZ(i, v3.x, v3.y, v3.z);
      }
      pos.needsUpdate = true;
    };

    coronaMesh.userData.update = update;
    this.corona = coronaMesh;
  }

  createGlow() {
    const sunGlowMaterial = createFresnelMaterial({
      color1: 0x000000,
      color2: 0xff0000,
    });
    const sunGlowGeometry = new IcosahedronGeometry(5, 12);
    const sunGlowMesh = new Mesh(sunGlowGeometry, sunGlowMaterial);
    sunGlowMesh.scale.setScalar(1.1);
    this.glow = sunGlowMesh;
  }

  createRim() {
    const sunRimMaterial = createFresnelMaterial({
      color1: 0xffff99,
      color2: 0x000000,
    });
    const sunRimGeometry = new IcosahedronGeometry(5, 12);
    const sunRimMesh = new Mesh(sunRimGeometry, sunRimMaterial);
    sunRimMesh.scale.setScalar(1.01);
    this.sunRim = sunRimMesh;
  }

  addLighting() {
    // Intensity is candela; inverse-square falloff needs a high value
    // so outer planets (orbit ~30) still receive useful illumination.
    const sunLight = new PointLight(0xfff2cc, 12000, 0, 2);
    sunLight.position.set(0, 0, 0);
    this.group.add(sunLight);
  }

  update(dt) {
    this.elapsed += dt * 1000;
    const time = this.elapsed * 0.00051;
    this.group.rotation.y = -time / 5;
    this.corona.userData.update(time);
  }
}
