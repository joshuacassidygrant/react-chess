import {Coordinate, TokenMap} from "../types";

export function pieceOfColorAtCoordinate(coord: Coordinate, color: string, tokenMap: TokenMap): boolean {
    return Object.values(tokenMap).find(entry => entry.color === color && coordinatesEqual(entry.coord, coord)) !== undefined;
}

export function emptyCoordinate(coord: Coordinate, tokenMap: TokenMap): boolean {
    return Object.values(tokenMap).find(entry => coordinatesEqual(entry.coord, coord)) === undefined;
}

export function coordinateInList(coord: Coordinate, listCoords: Coordinate[]): boolean {
    return !!listCoords.find(entry => entry && coordinatesEqual(entry, coord));
}

export function coordinatesEqual(c1?:Coordinate, c2?: Coordinate):boolean {
    if (!c1 || !c2) return false;
    return c1.x === c2.x && c1.y === c2.y  && c1.grid.id === c2.grid.id;
}
