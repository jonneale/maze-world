export {};
const PIXEL_WIDTH = 10;
const PIXEL_HEIGHT = 10;
const MAZE_WIDTH = 100;
const MAZE_HEIGHT = 100;
const TIME_INTERVAL = 1;
const NUMBER_OF_MAZE_RUNNERS = 20;

class Direction{
    private _cardinalDirection: string;
    private _coordTransform: number[];

    constructor(cardinalDirection: string, coordTransform: number[]){
	this._cardinalDirection = cardinalDirection;
	this._coordTransform = coordTransform;
    }

    public get name(){
	return this._cardinalDirection;
    }

    public xTransform(){
	return this._coordTransform[0];
    }

    public yTransform(){
	return this._coordTransform[1];
    }

    public transformCoord(coord: Coord){
	return [coord.x+this.xTransform(), coord.y+this.yTransform()];
    }    
}

function rand(max: number){
    return Math.floor(Math.random()*max)
}

function findOppositeDirection(direction: string){
    switch(direction) {
	case "N":
	    return "S";
	case "S":
	    return "N";
	case "E":
	    return "W";
	case "W":
	    return "E";
    }
} 

const N = new Direction("N",[0,-1]);
const S = new Direction("S",[0,1]);
const E = new Direction("E",[1,0]);
const W = new Direction("W",[-1,0]);

const allDirections = [N, E, S, W];

function findDirection(directionName : string){
    return allDirections.filter((direction) => direction.name === directionName)[0];
}

class Coord{
    private _x: number;
    private _y: number;
    private maxX: number;
    private maxY: number;
    private _holes: Direction[];
    
    constructor(x: number,y: number, maxX: number, maxY: number){
	this._x = x;
	this._y = y;
	this.maxX = maxX;
	this.maxY = maxY;
	this._holes = [];
    }

    public get x(){
	return this._x;
    }

    public hasHole(direction: Direction){
	return this._holes.includes(direction);
    }
    public noHoles(){
	return this._holes.length === 0;
    }
    public carveHole(direction: Direction){
	this._holes.push(direction);
    }

    private getValidNeighbourDirections(directions : Direction[]){
	let neighbours = [];
	for (let direction of directions){
	    let [possX, possY] = direction.transformCoord(this);
	    if (this.validValue(possX, this.maxX) && this.validValue(possY, this.maxY)){
		neighbours.push(direction)
	    }
	}
	return neighbours;
    }
    
    public validNeighbourDirections(){
	let uncarvedDirections = allDirections.filter((direction) => !this._holes.includes(direction))
	return this.getValidNeighbourDirections(uncarvedDirections);
    }

    public get y(){
	return this._y;
    }

    private validValue(value: number, max: number){
	return (value >= 0) && (value < max); 
    }
}


class Grid{
    private _grid: Coord[][];
    private _width: number;
    private _height: number;

    constructor(width: number, height: number){
	this._grid = [];
	this._width = width;
	this._height = height;
	for(let x=0;x<width;x++){
	    this._grid[x] = [];
	    for(let y=0;y<height;y++){
		this._grid[x][y] = new Coord(x,y,width,height);
	    }
	}
    }

    public getCell(coords: number[]){
	let [x,y] = coords;
	return this._grid[x][y];
    }

    public get width(){
	return this._width;
    }

    public get height(){
	return this._height;
    }
}

class State{
    private _currentCells: Array<Coord>;
    private _visitedCells: Coord[];
    private _grid: Grid;
    private _allFinished: Boolean;
    private _finished: Boolean[];
    private _agenda: Coord[][];

    constructor(width: number, height: number) {
	this._visitedCells = [];
	this._agenda = [];
	this._finished = [];
	this._grid = new Grid(width, height);
	this._allFinished = false;
	this._currentCells = []
	for(let i=0; i < NUMBER_OF_MAZE_RUNNERS; i++) {
	    let cell = this._grid.getCell([rand(width),rand(height)])
	    this._currentCells.push(cell);
	    this._agenda[i] = [];
	    this._finished[i] = false;
	};
    }
    
    public get grid(){
	return this._grid;
    }

    public get agenda(){
	return this._agenda;
    }

    public set agenda(v){
	this._agenda = v;
    }

    private removePreviouslySeenDirections(currentCell : Coord, possibleNextDirections : Direction[]){
	return possibleNextDirections.filter((direction) => !this._visitedCells.includes(this.grid.getCell(direction.transformCoord(currentCell))));
    }
    
    public updateOneTick(){
	for(let i = 0; i < NUMBER_OF_MAZE_RUNNERS; i++){
	    if(this._finished[i] !== true){
		let currentCell = this.currentCells[i];
		let agenda = this.agenda[i]
		this.visitedCells.push(currentCell);
		let possibleNextDirections = currentCell.validNeighbourDirections();
		let validPossibleNextCells = this.removePreviouslySeenDirections(currentCell, possibleNextDirections);
		if (validPossibleNextCells.length === 0){
		    if (agenda.length === 0) {
			this._finished[i] = true;
			console.log("finished");
			console.log(this._finished);
			console.log("all-finished? " + this.allFinished());
			return;
		    }
		    else{
			this.currentCells[i] = agenda.pop() as Coord;
		    }
		} else {
		    agenda.push(currentCell);
		    let randomDirection = validPossibleNextCells[rand(validPossibleNextCells.length)] as Direction;
		    let randomNeighbour = this.grid.getCell(randomDirection.transformCoord(currentCell));
		    currentCell.carveHole(randomDirection);
		    let oppositeDirectionName = findOppositeDirection(randomDirection.name) as string;
		    let oppositeDirection = findDirection(oppositeDirectionName);
		    randomNeighbour.carveHole(oppositeDirection);
		    this.currentCells[i] = randomNeighbour;
		}
	    }
	}
	return this;
    }

    public allFinished(){
	if (this._allFinished === true) { return true; }
	let allFinished = this._finished.reduce(
	    (accumulator, currentValue) => accumulator && currentValue,
	    true,
	);
	this._allFinished = allFinished;
	return this._allFinished;
    }

    public set finished(v: []){
	this._finished = v;
    }

    public get currentCells() : Coord[]{
	return this._currentCells;
    }

    public set currentCells(theCell: Coord[]){
	this._currentCells = theCell;
    }

    public get visitedCells(){
	return this._visitedCells;
    }

    public set visitedCells(updatedVisitedCells){
	this._visitedCells = updatedVisitedCells;
    }
}

class MazeGenerator{
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private currentState: State;
    private pixelHeight: number;
    private pixelWidth: number;
    private intervalId: number;

    constructor(width: number, height: number) {
	let canvas = document.getElementById('maze-canvas') as HTMLCanvasElement;
	let context = canvas.getContext("2d") as CanvasRenderingContext2D;
	this.pixelHeight = PIXEL_HEIGHT;
	this.pixelWidth = PIXEL_WIDTH;
	this.canvas = canvas;
	this.context = context;
	this.currentState = new State(width, height);
	this.intervalId = setInterval(() => this.main(width, height, this.currentState), TIME_INTERVAL);
    }

    main(width: number, height: number, currentState: State){
	if(currentState.allFinished() === false){
	    currentState.updateOneTick();
	    this.redraw(width, height, currentState);
	}
	else{
	    clearInterval(this.intervalId);
	    console.log("all finished");
	}
	
    }

    private redraw(width: number, height: number, state: State){
	let context = this.context as CanvasRenderingContext2D;
	context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	context.fillStyle = 'blue';
	context.strokeStyle = 'red';
	context.beginPath();
	for(let x = 0; x < state.grid.width; x++){
	    for (let y = 0; y < state.grid.height; y++){
		
		let currentCell = state.grid.getCell([x,y]);
		
		//move to topleft
		context.moveTo(x*this.pixelWidth+1, y*this.pixelHeight+1);
		
		//North Side - move to top right
		if (currentCell.hasHole(N)){
		    context.moveTo((x+1)*this.pixelHeight+1, y*this.pixelHeight+1);
		}
		else {
		    context.lineTo((x+1)*this.pixelHeight+1, y*this.pixelHeight+1);
		}

		//East side - move to bottom right
		if (currentCell.hasHole(E)){
		    context.moveTo((x+1)*this.pixelHeight+1, (y+1)*this.pixelHeight+1);
		}
		else {
		    context.lineTo((x+1)*this.pixelHeight+1, (y+1)*this.pixelHeight+1);
		}

		//South side - move to bottom left
		if (currentCell.hasHole(S)){
		    context.moveTo((x)*this.pixelHeight+1, (y+1)*this.pixelHeight+1);
		}
		else {
		    context.lineTo((x)*this.pixelHeight+1, (y+1)*this.pixelHeight+1);
		}

		//West side - move to top left
		if (currentCell.hasHole(W)){
		    context.moveTo(x*this.pixelHeight+1, y*this.pixelHeight+1);
		}
		else {
		    context.lineTo(x*this.pixelHeight+1, y*this.pixelHeight+1);
		}

	    }
	}
	context.stroke();
	let colours = ["aqua", "black", "blue", "fuchsia", "gray", "green", "lime", "maroon", "navy", "olive", "purple", "red", "silver", "teal", "white", "yellow"]
	for(let i = 0; i < NUMBER_OF_MAZE_RUNNERS; i++){
	    let currentCell = state.currentCells[i];
	    let colour = colours[i];
	    context.fillStyle = colour;
	    context.fillRect(currentCell.x*this.pixelWidth+1, currentCell.y*this.pixelHeight+1, this.pixelWidth, this.pixelHeight);
	}
	
    }
}

window.onload = () => {
    new MazeGenerator(MAZE_WIDTH,MAZE_HEIGHT);
};
