"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CANVAS_WIDTH = 100;
const CANVAS_HEIGHT = 100;
const PIXEL_WIDTH = 10;
const PIXEL_HEIGHT = 10;
const TIME_INTERVAL = 100;
class State {
    constructor(width, height) {
        this._width = width;
        this._height = height;
        this._currentTick = 0;
    }
}
class DaisyWorldGenerator {
    constructor(width, height) {
        let canvas = document.getElementById('maze-canvas');
        let context = canvas.getContext("2d");
        this.canvas = canvas;
        this.context = context;
        this.currentState = new State(width, height);
        this.intervalId = setInterval(() => this.main(width, height, this.currentState), TIME_INTERVAL);
    }
    main(width, height, currentState) {
    }
    redraw() {
        let context = this.context;
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        context.fillStyle = 'blue';
        context.strokeStyle = 'red';
        context.fillRect(0, 0, 150, 150);
    }
}
window.onload = () => {
    new DaisyWorldGenerator(CANVAS_WIDTH, CANVAS_HEIGHT);
};
