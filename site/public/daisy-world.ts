export{};
const CANVAS_WIDTH=100;
const CANVAS_HEIGHT=100;
const PIXEL_WIDTH=10;
const PIXEL_HEIGHT=10;
const TIME_INTERVAL=100;

class State {
    private _width: number;
    private _height: number;
    private _currentTick: number;
    
    constructor(width: number, height: number){
	this._width = width;
	this._height = height;
	this._currentTick = 0;
    }
}

class DaisyWorldGenerator{
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private currentState: State;
    private intervalId: number;
    
    constructor(width: number, height: number){
	let canvas = document.getElementById('maze-canvas') as HTMLCanvasElement;
	let context = canvas.getContext("2d") as CanvasRenderingContext2D;
	this.canvas = canvas;
	this.context = context;
	this.currentState = new State(width, height);
	this.intervalId = setInterval(() => this.main(width, height, this.currentState), TIME_INTERVAL);
    }
    
    main(width : number, height : number, currentState : State)
    {
    }

    redraw(){
	let context = this.context as CanvasRenderingContext2D;
	context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	context.fillStyle = 'blue';
	context.strokeStyle = 'red';
	context.fillRect(0,0,150,150);
    }

    
}

window.onload = () => {
    new DaisyWorldGenerator(CANVAS_WIDTH, CANVAS_HEIGHT);
};
