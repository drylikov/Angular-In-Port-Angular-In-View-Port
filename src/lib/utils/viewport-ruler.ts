import { Injectable } from '@angular/core';



export class WindowRulerStatic {
  private static _windowRect: ClientRect;
  private static _createWindowRect() {
    const height = window.innerHeight;
    const width = window.innerWidth;
    return {
      top: 0,
      left: 0,
      bottom: height,
      right: width,
      height,
      width,
    };
  }
  static onChange() {
    this._windowRect = this._createWindowRect();
  }
  static getWindowViewPortRuler() {
    return this._windowRect;
  }
}

@Injectable()
export class WindowRuler {
  constructor() {
    WindowRulerStatic.onChange();
  }
  onChange() {
    WindowRulerStatic.onChange();
  }
  getWindowViewPortRuler() {
    return WindowRulerStatic.getWindowViewPortRuler();
  }
}






