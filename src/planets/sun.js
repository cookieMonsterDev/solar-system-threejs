import {
  Mesh,
  Color,
  Group,
  AmbientLight,
  TextureLoader,
  ShaderMaterial,
  AdditiveBlending,
  IcosahedronGeometry,
  MeshStandardMaterial,
} from "three";

const sun = new Group();

const loader = new TextureLoader();

const sunGeometry = new IcosahedronGeometry(1, 12);
const sunMaterial = new MeshStandardMaterial({
  map: loader.load("/assets/sun-map.jpg"),
});
const sunMesh = new Mesh(sunGeometry, sunMaterial);
sun.add(sunMesh);

const sunLight = new AmbientLight(0xfff3b5, 2.0);
sun.add(sunLight);

const sunGlowMaterial = (color1, color2) =>
  new ShaderMaterial({
    uniforms: {
      color1: { value: new Color(color1) },
      color2: { value: new Color(color2) },
      fresnelBias: { value: 0.1 },
      fresnelScale: { value: 1.0 },
      fresnelPower: { value: 4.0 },
    },
    vertexShader: `
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
  `,
    fragmentShader: `
  uniform vec3 color1;
  uniform vec3 color2;
  
  varying float vReflectionFactor;
  
  void main() {
    float f = clamp( vReflectionFactor, 0.0, 1.0 );
    gl_FragColor = vec4(mix(color2, color1, vec3(f)), f);
  }
  `,
    transparent: true,
    blending: AdditiveBlending,
  });

const sunGlowMesh1 = new Mesh(sunGeometry, sunGlowMaterial(0x000000, 0xffde21));
const sunGlowMesh2 = new Mesh(sunGeometry, sunGlowMaterial(0xff0000, 0x000000));

sunGlowMesh1.scale.setScalar(1.02);
sunGlowMesh2.scale.setScalar(1.5);
sun.add(sunGlowMesh1);
sun.add(sunGlowMesh2);

const sunAnimation = () => {
  sun.rotation.y += 0.0005;
};

export { sun, sunAnimation };
