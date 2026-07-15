import { Group } from "three";

/**
 * Base class for scene objects that participate in the animation loop.
 * Subclasses should build into `this.group` and override `update` as needed.
 */
export class CelestialBody {
  constructor() {
    this.group = new Group();
  }

  /** @returns {import("three").Object3D} */
  getObject3D() {
    return this.group;
  }

  /** @param {number} _dt Delta time in seconds */
  update(_dt) {}
}
