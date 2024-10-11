"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PIXEL_WIDTH = 10;
const PIXEL_HEIGHT = 10;
const MAZE_WIDTH = 100;
const MAZE_HEIGHT = 100;
const TIME_INTERVAL = 1;
const NUMBER_OF_MAZE_RUNNERS = 20;
class Direction {
    constructor(cardinalDirection, coordTransform) {
        this._cardinalDirection = cardinalDirection;
        this._coordTransform = coordTransform;
    }
    get name() {
        return this._cardinalDirection;
    }
    xTransform() {
        return this._coordTransform[0];
    }
    yTransform() {
        return this._coordTransform[1];
    }
    transformCoord(coord) {
        return [coord.x + this.xTransform(), coord.y + this.yTransform()];
    }
}
function rand(max) {
    return Math.floor(Math.random() * max);
}
function findOppositeDirection(direction) {
    switch (direction) {
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
const N = new Direction("N", [0, -1]);
const S = new Direction("S", [0, 1]);
const E = new Direction("E", [1, 0]);
const W = new Direction("W", [-1, 0]);
const allDirections = [N, E, S, W];
function findDirection(directionName) {
    return allDirections.filter((direction) => direction.name === directionName)[0];
}
class Coord {
    constructor(x, y, maxX, maxY) {
        this._x = x;
        this._y = y;
        this.maxX = maxX;
        this.maxY = maxY;
        this._holes = [];
    }
    get x() {
        return this._x;
    }
    hasHole(direction) {
        return this._holes.includes(direction);
    }
    noHoles() {
        return this._holes.length === 0;
    }
    carveHole(direction) {
        this._holes.push(direction);
    }
    getValidNeighbourDirections(directions) {
        let neighbours = [];
        for (let direction of directions) {
            let [possX, possY] = direction.transformCoord(this);
            if (this.validValue(possX, this.maxX) && this.validValue(possY, this.maxY)) {
                neighbours.push(direction);
            }
        }
        return neighbours;
    }
    validNeighbourDirections() {
        let uncarvedDirections = allDirections.filter((direction) => !this._holes.includes(direction));
        return this.getValidNeighbourDirections(uncarvedDirections);
    }
    get y() {
        return this._y;
    }
    validValue(value, max) {
        return (value >= 0) && (value < max);
    }
}
class Grid {
    constructor(width, height) {
        this._grid = [];
        this._width = width;
        this._height = height;
        for (let x = 0; x < width; x++) {
            this._grid[x] = [];
            for (let y = 0; y < height; y++) {
                this._grid[x][y] = new Coord(x, y, width, height);
            }
        }
    }
    getCell(coords) {
        let [x, y] = coords;
        return this._grid[x][y];
    }
    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }
}
class State {
    constructor(width, height) {
        this._visitedCells = [];
        this._agenda = [];
        this._finished = [];
        this._grid = new Grid(width, height);
        this._allFinished = false;
        this._currentCells = [];
        for (let i = 0; i < NUMBER_OF_MAZE_RUNNERS; i++) {
            let cell = this._grid.getCell([rand(width), rand(height)]);
            this._currentCells.push(cell);
            this._agenda[i] = [];
            this._finished[i] = false;
        }
        ;
    }
    get grid() {
        return this._grid;
    }
    get agenda() {
        return this._agenda;
    }
    set agenda(v) {
        this._agenda = v;
    }
    removePreviouslySeenDirections(currentCell, possibleNextDirections) {
        return possibleNextDirections.filter((direction) => !this._visitedCells.includes(this.grid.getCell(direction.transformCoord(currentCell))));
    }
    updateOneTick() {
        for (let i = 0; i < NUMBER_OF_MAZE_RUNNERS; i++) {
            if (this._finished[i] !== true) {
                let currentCell = this.currentCells[i];
                let agenda = this.agenda[i];
                this.visitedCells.push(currentCell);
                let possibleNextDirections = currentCell.validNeighbourDirections();
                let validPossibleNextCells = this.removePreviouslySeenDirections(currentCell, possibleNextDirections);
                if (validPossibleNextCells.length === 0) {
                    if (agenda.length === 0) {
                        this._finished[i] = true;
                        console.log("finished");
                        console.log(this._finished);
                        console.log("all-finished? " + this.allFinished());
                        return;
                    }
                    else {
                        this.currentCells[i] = agenda.pop();
                    }
                }
                else {
                    agenda.push(currentCell);
                    let randomDirection = validPossibleNextCells[rand(validPossibleNextCells.length)];
                    let randomNeighbour = this.grid.getCell(randomDirection.transformCoord(currentCell));
                    currentCell.carveHole(randomDirection);
                    let oppositeDirectionName = findOppositeDirection(randomDirection.name);
                    let oppositeDirection = findDirection(oppositeDirectionName);
                    randomNeighbour.carveHole(oppositeDirection);
                    this.currentCells[i] = randomNeighbour;
                }
            }
        }
        return this;
    }
    allFinished() {
        if (this._allFinished === true) {
            return true;
        }
        let allFinished = this._finished.reduce((accumulator, currentValue) => accumulator && currentValue, true);
        this._allFinished = allFinished;
        return this._allFinished;
    }
    set finished(v) {
        this._finished = v;
    }
    get currentCells() {
        return this._currentCells;
    }
    set currentCells(theCell) {
        this._currentCells = theCell;
    }
    get visitedCells() {
        return this._visitedCells;
    }
    set visitedCells(updatedVisitedCells) {
        this._visitedCells = updatedVisitedCells;
    }
}
class MazeGenerator {
    constructor(width, height) {
        let canvas = document.getElementById('maze-canvas');
        let context = canvas.getContext("2d");
        this.pixelHeight = PIXEL_HEIGHT;
        this.pixelWidth = PIXEL_WIDTH;
        this.canvas = canvas;
        this.context = context;
        this.currentState = new State(width, height);
        this.intervalId = setInterval(() => this.main(width, height, this.currentState), TIME_INTERVAL);
    }
    main(width, height, currentState) {
        if (currentState.allFinished() === false) {
            currentState.updateOneTick();
            this.redraw(width, height, currentState);
        }
        else {
            clearInterval(this.intervalId);
            console.log("all finished");
        }
    }
    redraw(width, height, state) {
        let context = this.context;
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        context.fillStyle = 'blue';
        context.strokeStyle = 'red';
        context.beginPath();
        for (let x = 0; x < state.grid.width; x++) {
            for (let y = 0; y < state.grid.height; y++) {
                let currentCell = state.grid.getCell([x, y]);
                //move to topleft
                context.moveTo(x * this.pixelWidth + 1, y * this.pixelHeight + 1);
                //North Side - move to top right
                if (currentCell.hasHole(N)) {
                    context.moveTo((x + 1) * this.pixelHeight + 1, y * this.pixelHeight + 1);
                }
                else {
                    context.lineTo((x + 1) * this.pixelHeight + 1, y * this.pixelHeight + 1);
                }
                //East side - move to bottom right
                if (currentCell.hasHole(E)) {
                    context.moveTo((x + 1) * this.pixelHeight + 1, (y + 1) * this.pixelHeight + 1);
                }
                else {
                    context.lineTo((x + 1) * this.pixelHeight + 1, (y + 1) * this.pixelHeight + 1);
                }
                //South side - move to bottom left
                if (currentCell.hasHole(S)) {
                    context.moveTo((x) * this.pixelHeight + 1, (y + 1) * this.pixelHeight + 1);
                }
                else {
                    context.lineTo((x) * this.pixelHeight + 1, (y + 1) * this.pixelHeight + 1);
                }
                //West side - move to top left
                if (currentCell.hasHole(W)) {
                    context.moveTo(x * this.pixelHeight + 1, y * this.pixelHeight + 1);
                }
                else {
                    context.lineTo(x * this.pixelHeight + 1, y * this.pixelHeight + 1);
                }
            }
        }
        context.stroke();
        let colours = ["aqua", "black", "blue", "fuchsia", "gray", "green", "lime", "maroon", "navy", "olive", "purple", "red", "silver", "teal", "white", "yellow"];
        for (let i = 0; i < NUMBER_OF_MAZE_RUNNERS; i++) {
            let currentCell = state.currentCells[i];
            let colour = colours[i];
            context.fillStyle = colour;
            context.fillRect(currentCell.x * this.pixelWidth + 1, currentCell.y * this.pixelHeight + 1, this.pixelWidth, this.pixelHeight);
        }
    }
}
window.onload = () => {
    new MazeGenerator(MAZE_WIDTH, MAZE_HEIGHT);
};
