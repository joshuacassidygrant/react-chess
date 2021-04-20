import {Position, Coordinate} from "./index";

export class GridData {
    id: string;
    height: number;
    width: number;
    xWidthCells: number;
    yHeightCells: number;
    xOffset: number;
    yOffset: number;
    xCellWidth: number;
    yCellHeight: number;

    constructor(id: string, height: number, width: number, xWidthCells: number, yHeightCells: number) { 
        this.id = id;
        this.xWidthCells = xWidthCells;
        this.yHeightCells = yHeightCells;
        this.height = height;
        this.width = width;
        this.xCellWidth = width/xWidthCells;
        this.yCellHeight = height/yHeightCells;
        this.xOffset = width/xWidthCells;
        this.yOffset = height/yHeightCells;
    }

    gridQuantizePosition(pos: Position): Position {
        return {x:pos.x - (pos.x % this.xCellWidth) + this.xOffset, y:pos.y - (pos.y % this.yCellHeight) + this.yOffset};
    }
    
    getGridCoordinates(pos: Position): Coordinate {
        return {x: Math.floor((pos.x - this.xOffset)/this.xCellWidth), y: Math.floor((pos.y - this.yOffset)/this.yCellHeight), grid: this};
    }
    
    inGridBounds(pos: Position, grid: GridData): boolean {
        return this.coordinateInGridBounds(this.getGridCoordinates(pos));
    }
    
    coordinateInGridBounds(coords: Coordinate): boolean {
        return coords.x >= 0 && coords.y >= 0 && coords.x < this.xWidthCells && coords.y < this.yHeightCells;
    }
    
    getPositionFromCoordinates(coords: Coordinate): Position {
        return {x: coords.x * this.xCellWidth + this.xOffset, y: coords.y * this.yCellHeight + this.yOffset};
    }
}