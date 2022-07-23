export class Controls {
  up: boolean;

  down: boolean;

  left: boolean;

  right: boolean;

  constructor(type: string) {
    this.up = false;
    this.down = false;
    this.left = false;
    this.right = false;

    switch (type) {
      case "KEYS": {
        this.addKeyboardEventListener();
        break;
      }
      case "AI": {
        this.up = true;
        this.right = true;
        break;
      }
      default: {
        break;
      }
    } // switch (type)
  } // constructor

  private addKeyboardEventListener() {
    window.onkeydown = (event) => this.ifKeysMatchThenGoTo(event, true);
    window.onkeyup = (event) => this.ifKeysMatchThenGoTo(event, false);
  }

  ifKeysMatchThenGoTo(event: KeyboardEvent, bool: boolean): any {
    if (bool) {
      if (event.key === "ArrowUp") this.up = bool;
      if (event.key === "ArrowDown") this.down = bool;
      if (event.key === "ArrowLeft") this.left = bool;
      if (event.key === "ArrowRight") this.right = bool;
    } else {
      if (event.key === "ArrowUp") this.up = bool;
      if (event.key === "ArrowDown") this.down = bool;
      if (event.key === "ArrowLeft") this.left = bool;
      if (event.key === "ArrowRight") this.right = bool;
    }
  }
}
