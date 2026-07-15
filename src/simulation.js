/**
 * Owns simulation time state and keeps a Three.js Timer in sync.
 */
export class Simulation {
  #timeScale = 1;
  #paused = false;
  #timer;

  /** @param {import("three").Timer} timer */
  constructor(timer) {
    this.#timer = timer;
    this.#applyTimescale();
  }

  getTimeScale() {
    return this.#timeScale;
  }

  setTimeScale(value) {
    this.#timeScale = value;
    this.#applyTimescale();
  }

  getPaused() {
    return this.#paused;
  }

  setPaused(value) {
    this.#paused = value;
    this.#applyTimescale();
  }

  getEffectiveTimescale() {
    return this.#paused ? 0 : this.#timeScale;
  }

  #applyTimescale() {
    this.#timer.setTimescale(this.getEffectiveTimescale());
  }
}
