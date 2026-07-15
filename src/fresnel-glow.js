import { Color, ShaderMaterial, AdditiveBlending } from "three";

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

/**
 * @param {object} options
 * @param {number} [options.color1=0x0088ff]
 * @param {number} [options.color2=0x000000]
 * @param {number} [options.bias=0.2]
 * @param {number} [options.scale=1.5]
 * @param {number} [options.power=4.0]
 */
export function createFresnelMaterial({
  color1 = 0x0088ff,
  color2 = 0x000000,
  bias = 0.2,
  scale = 1.5,
  power = 4.0,
} = {}) {
  return new ShaderMaterial({
    uniforms: {
      color1: { value: new Color(color1) },
      color2: { value: new Color(color2) },
      fresnelBias: { value: bias },
      fresnelScale: { value: scale },
      fresnelPower: { value: power },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    blending: AdditiveBlending,
  });
}
