import {
  Mesh,
  Color,
  Group,
  DoubleSide,
  TorusGeometry,
  TextureLoader,
  ShaderMaterial,
  SRGBColorSpace,
  AdditiveBlending,
  MeshPhongMaterial,
  MeshBasicMaterial,
  IcosahedronGeometry,
  MeshStandardMaterial,
} from "three";

export class Earth {
  #group;
  #loader;
  #animate;
  #planetGroup;
  #planetGeometry;

  constructor({
    orbitSpeed = 1,
    orbitRadius = 1,

    planetSize = 1,
    planetRotationSpeed = 1,
  } = {}) {
    this.orbitSpeed = orbitSpeed;
    this.orbitRadius = orbitRadius;

    this.planetSize = planetSize;
    this.planetRotationSpeed = planetRotationSpeed;

    this.#group = new Group();
    this.#planetGroup = new Group();
    this.#loader = new TextureLoader();
    this.#planetGeometry = new IcosahedronGeometry(planetSize, 12);

    this.#createGlow();
    this.#createOrbit();
    this.#createPlanet();
    this.#createPlanetLights();
    this.#createPlanetClouds();

    this.#animate = this.#createAnimateFunction();
    this.#animate();
  }

  #createOrbit() {
    const orbitGeometry = new TorusGeometry(this.orbitRadius, 0.01, 100);
    const orbitMaterial = new MeshBasicMaterial({
      color: 0xadd8e6,
      side: DoubleSide,
    });
    const orbitMesh = new Mesh(orbitGeometry, orbitMaterial);
    orbitMesh.rotation.x = (90 * Math.PI) / 180;
    this.#group.add(orbitMesh);
  }

  #createPlanet() {
    const map = this.#loader.load("/assets/earth-map-1.jpg");

    const planetMaterial = new MeshPhongMaterial({ map, bumpScale: 0.04 });
    planetMaterial.map.colorSpace = SRGBColorSpace;
    const planetMesh = new Mesh(this.#planetGeometry, planetMaterial);
    this.#planetGroup.add(planetMesh);
    this.#planetGroup.position.x = this.orbitRadius - this.planetSize / 9;
    this.#planetGroup.rotation.z = (-23.4 * Math.PI) / 180;

    this.#group.add(this.#planetGroup);
  }

  #createPlanetLights() {
    const planetLightsMaterial = new MeshBasicMaterial({
      map: this.#loader.load("/assets/earth-map-2.jpg"),
      blending: AdditiveBlending,
    });
    const planetLightsMesh = new Mesh(
      this.#planetGeometry,
      planetLightsMaterial
    );
    this.#planetGroup.add(planetLightsMesh);

    this.#group.add(this.#planetGroup);
  }

  #createPlanetClouds() {
    const planetCloudsMaterial = new MeshStandardMaterial({
      map: this.#loader.load("/assets/earth-map-3.jpg"),
      transparent: true,
      opacity: 0.8,
      blending: AdditiveBlending,
      alphaMap: this.#loader.load("/assets/earth-map-4.jpg"),
    });
    const planetCloudsMesh = new Mesh(
      this.#planetGeometry,
      planetCloudsMaterial
    );
    planetCloudsMesh.scale.setScalar(1.003);
    this.#planetGroup.add(planetCloudsMesh);

    this.#group.add(this.#planetGroup);
  }

  #createGlow() {
    const uniforms = {
      color1: { value: new Color(0x0088ff) },
      color2: { value: new Color(0x000000) },
      fresnelBias: { value: 0.1 },
      fresnelScale: { value: 1.0 },
      fresnelPower: { value: 4.0 },
    };

    const vertexShader = `
      uniform float fresnelBias;
      uniform float fresnelScale;
      uniform float fresnelPower;
      
      varying float vReflectionFactor;
      
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
      
        vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );
      
        vec3 I = worldPosition.xyz - cameraPosition;
      
        vReflectionFactor = fresnelBias + fresnelScale * pow( 1.0 + dot( normalize( I ), worldNormal ), fresnelPower );
      
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      uniform vec3 color1;
      uniform vec3 color2;
      
      varying float vReflectionFactor;
      
      void main() {
        float f = clamp( vReflectionFactor, 0.0, 1.0 );
        gl_FragColor = vec4(mix(color2, color1, vec3(f)), f);
      }
    `;

    const earthGlowMaterial = new ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: AdditiveBlending,
    });
    const earthGlowMesh = new Mesh(this.#planetGeometry, earthGlowMaterial);
    earthGlowMesh.scale.setScalar(1.1);
    this.#planetGroup.add(earthGlowMesh);
  }

  #createAnimateFunction() {
    return () => {
      requestAnimationFrame(this.#animate);

      this.#group.rotation.y -= this.orbitSpeed;
      this.#planetGroup.rotation.y += this.planetRotationSpeed;
    };
  }

  getEarth() {
    return this.#group;
  }
}
