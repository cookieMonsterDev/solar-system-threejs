import {
  Color,
  Points,
  Vector3,
  TextureLoader,
  PointsMaterial,
  BufferGeometry,
  Float32BufferAttribute,
} from "three";

const randomSpherePoint = () => {
  const radius = Math.random() * 25 + 25;
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  let x = radius * Math.sin(phi) * Math.cos(theta);
  let y = radius * Math.sin(phi) * Math.sin(theta);
  let z = radius * Math.cos(phi);

  return {
    pos: new Vector3(x, y, z),
    hue: 0.6,
    minDist: radius,
  };
};

export const generateStarfield = ({ numStars = 500 } = {}) => {
  let col;
  const verts = [];
  const colors = [];
  const positions = [];

  for (let i = 0; i < numStars; i += 1) {
    let p = randomSpherePoint();
    const { pos, hue } = p;
    positions.push(p);
    col = new Color().setHSL(hue, 0.2, Math.random());
    verts.push(pos.x, pos.y, pos.z);
    colors.push(col.r, col.g, col.b);
  }

  const geo = new BufferGeometry();
  geo.setAttribute("position", new Float32BufferAttribute(verts, 3));
  geo.setAttribute("color", new Float32BufferAttribute(colors, 3));
  const mat = new PointsMaterial({
    size: 0.2,
    vertexColors: true,
    map: new TextureLoader().load("/assets/circle.png"),
  });
  const points = new Points(geo, mat);
  return points;
};
