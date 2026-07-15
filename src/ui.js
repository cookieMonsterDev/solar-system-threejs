const SPEED_PRESETS = [0.5, 1, 2, 5, 10];

/** Top-right simulation controls: pause + speed presets. */
export class TimeControls {
  #simulation;
  #root;
  #pauseBtn;
  #speedButtons;

  /** @param {import("./simulation").Simulation} simulation */
  constructor(simulation) {
    this.#simulation = simulation;
    this.#root = document.createElement("div");
    this.#root.className = "time-controls";
    this.#root.setAttribute("role", "group");
    this.#root.setAttribute("aria-label", "Simulation speed");

    this.#pauseBtn = document.createElement("button");
    this.#pauseBtn.type = "button";
    this.#pauseBtn.className = "time-controls__pause";
    this.#pauseBtn.setAttribute("aria-pressed", "false");

    const speeds = document.createElement("div");
    speeds.className = "time-controls__speeds";

    this.#speedButtons = SPEED_PRESETS.map((speed) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "time-controls__speed";
      btn.dataset.speed = String(speed);
      btn.textContent = `${speed}×`;
      btn.addEventListener("click", () => {
        this.#simulation.setPaused(false);
        this.#simulation.setTimeScale(speed);
        this.sync();
      });
      speeds.appendChild(btn);
      return btn;
    });

    this.#pauseBtn.addEventListener("click", () => {
      this.#simulation.setPaused(!this.#simulation.getPaused());
      this.sync();
    });

    window.addEventListener("keydown", (event) => this.#onKeyDown(event));

    this.#root.appendChild(this.#pauseBtn);
    this.#root.appendChild(speeds);
  }

  /** @param {HTMLElement} [parent=document.body] */
  mount(parent = document.body) {
    parent.appendChild(this.#root);
    this.sync();
    return this;
  }

  sync() {
    const paused = this.#simulation.getPaused();
    const scale = this.#simulation.getTimeScale();

    this.#pauseBtn.textContent = paused ? "Play" : "Pause";
    this.#pauseBtn.setAttribute("aria-pressed", String(paused));
    this.#pauseBtn.classList.toggle("is-paused", paused);

    this.#speedButtons.forEach((btn) => {
      const speed = Number(btn.dataset.speed);
      const active = !paused && speed === scale;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
    });
  }

  #onKeyDown(event) {
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement
    ) {
      return;
    }

    if (event.code === "Space") {
      event.preventDefault();
      this.#simulation.setPaused(!this.#simulation.getPaused());
      this.sync();
      return;
    }

    if (event.key === "[") {
      const idx = SPEED_PRESETS.indexOf(this.#simulation.getTimeScale());
      const next = SPEED_PRESETS[Math.max(0, (idx === -1 ? 1 : idx) - 1)];
      this.#simulation.setPaused(false);
      this.#simulation.setTimeScale(next);
      this.sync();
      return;
    }

    if (event.key === "]") {
      const idx = SPEED_PRESETS.indexOf(this.#simulation.getTimeScale());
      const next =
        SPEED_PRESETS[
          Math.min(SPEED_PRESETS.length - 1, (idx === -1 ? 1 : idx) + 1)
        ];
      this.#simulation.setPaused(false);
      this.#simulation.setTimeScale(next);
      this.sync();
    }
  }
}
