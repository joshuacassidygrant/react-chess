import {Position, Coordinate, TokenMap, GridData} from "../types";

export function pieceOfColorAtCoordinate(coord: Coordinate, color: string, tokenMap: TokenMap): boolean {
    return Object.values(tokenMap).find(entry => entry.color === color && entry.coord && entry.coord.x === coord.x && entry.coord.y === coord.y  && entry.coord.grid.id === coord.grid.id) !== undefined;
}

export function emptyCoordinate(coord: Coordinate, tokenMap: TokenMap): boolean {
    return Object.values(tokenMap).find(entry => entry.coord && entry.coord.x === coord.x && entry.coord.y === coord.y && entry.coord.grid.id === coord.grid.id) === undefined;
}

export function coordinateInList(coord: Coordinate, listCoords: Coordinate[]): boolean {
    return !!listCoords.find(entry => entry && entry.x === coord.x && entry.y === coord.y && entry.grid.id === coord.grid.id);
}

export function gridQuantizePosition(pos: Position, grid: GridData): Position {
    return {x:pos.x - (pos.x % grid.xCellWidth) + grid.xOffset, y:pos.y - (pos.y % grid.yCellHeight) + grid.yOffset};
}

export function getGridCoordinates(pos: Position, grid: GridData): Coordinate {
    return {x: Math.floor((pos.x - grid.xOffset)/grid.xCellWidth), y: Math.floor((pos.y - grid.yOffset)/grid.yCellHeight), grid};
}

export function getPositionFromCoordinates(coords: Coordinate): Position {
    return {x: coords.x * coords.grid.xCellWidth + coords.grid.xOffset, y: coords.y * coords.grid.yCellHeight + coords.grid.yOffset};
}

export function inLegalCells(legalCells: Coordinate[], x: number, y: number): boolean {
    return !!legalCells.find(c => c.x === x && c.y === y);
}

export function inGridBounds(pos: Position, grid: GridData): boolean {
    return coordinateInGridBounds(getGridCoordinates(pos, grid));
}

export function coordinateInGridBounds(coords: Coordinate): boolean {
    return coords.x >= 0 && coords.y >= 0 && coords.x < coords.grid.xWidthCells && coords.y < coords.grid.yHeightCells;
}