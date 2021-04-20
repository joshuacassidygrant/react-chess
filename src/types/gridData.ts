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
}