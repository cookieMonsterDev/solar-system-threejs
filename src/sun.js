import {
  Mesh,
  Group,
  Color,
  Vector3,
  BackSide,
  PointLight,
  TextureLoader,
  ShaderMaterial,
  AdditiveBlending,
  DynamicDrawUsage,
  MeshBasicMaterial,
  IcosahedronGeometry,
} from "three";
import { ImprovedNoise } from "three/addons/math/ImprovedNoise.js";

export class Sun {
  group;
  loader;
  animate;
  corona;
  sunRim;
  glow;

  constructor() {
    this.sunTexture = "/solar-system-threejs/assets/sun-map.jpg";

    this.group = new Group();
    this.loader = new TextureLoader();

    this.createCorona();
    this.createRim();
    this.addLighting();
    this.createGlow();
    this.createSun();

    this.animate = this.createAnimateFunction();
    this.animate();
  }

  createSun() {
    const map = this.loader.load(this.sunTexture);
    const sunGeometry = new IcosahedronGeometry(5, 12);
    const sunMaterial = new MeshBasicMaterial({
      map,
      emissive: new Color(0xffff99),
      emissiveIntensity: 1.5,
    });
    const sunMesh = new Mesh(sunGeometry, sunMaterial);
    this.group.add(sunMesh);

    this.group.add(this.sunRim);

    this.group.add(this.corona);

    this.group.add(this.glow);

    this.group.userData.update = (t) => {
      this.group.rotation.y = -t / 5;
      this.corona.userData.update(t);
    };
  }

  createCorona() {
    const coronaGeometry = new IcosahedronGeometry(4.9, 12);
    const coronaMaterial = new MeshBasicMaterial({
      color: 0xff0000,
      side: BackSide,
    });
    const coronaMesh = new Mesh(coronaGeometry, coronaMaterial);
    const coronaNoise = new ImprovedNoise();

    let v3 = new Vector3();
    let p = new Vector3();
    let pos = coronaGeometry.attributes.position;
    pos.usage = DynamicDrawUsage;
    const len = pos.count;

    const update = (t) => {
      for (let i = 0; i < len; i += 1) {
        p.fromBufferAttribute(pos, i).normalize();
        v3.copy(p).multiplyScalar(5);
        let ns = coronaNoise.noise(
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
    const uniforms = {
      color1: { value: new Color(0x000000) },
      color2: { value: new Color(0xff0000) },
      fresnelBias: { value: 0.2 },
      fresnelScale: { value: 1.5 },
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

    const sunGlowMaterial = new ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: AdditiveBlending,
    });
    const sunGlowGeometry = new IcosahedronGeometry(5, 12);
    const sunGlowMesh = new Mesh(sunGlowGeometry, sunGlowMaterial);
    sunGlowMesh.scale.setScalar(1.1);
    this.glow = sunGlowMesh;
  }

  createRim() {
    const uniforms = {
      color1: { value: new Color(0xffff99) },
      color2: { value: new Color(0x000000) },
      fresnelBias: { value: 0.2 },
      fresnelScale: { value: 1.5 },
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

    const sunRimMaterial = new ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: AdditiveBlending,
    });
    const sunRimGeometry = new IcosahedronGeometry(5, 12);
    const sunRimMesh = new Mesh(sunRimGeometry, sunRimMaterial);
    sunRimMesh.scale.setScalar(1.01);
    this.sunRim = sunRimMesh;
  }

  addLighting() {
    const sunLight = new PointLight(0xffff99, 1000);
    sunLight.position.set(0, 0, 0);
    this.group.add(sunLight);
  }

  createAnimateFunction() {
    return (t = 0) => {
      const time = t * 0.00051;
      requestAnimationFrame(this.animate);
      this.group.userData.update(time);
    };
  }

  getSun() {
    return this.group;
  }
}
