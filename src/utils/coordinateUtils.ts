import {Coordinate, TokenMap, TokenData, CoordinateMove, GridData} from "../types";

export function crd(x: number, y:number, grid: GridData): Coordinate {
    return {x, y, grid};
}

export function pieceOfColorAtCoordinate(coord: Coordinate, player: number, tokenMap: TokenMap): boolean {
    return Object.values(tokenMap).find(entry => entry.player === player && coordinatesEqual(entry.coord, coord)) !== undefined;
}

export function emptyCoordinate(coord: Coordinate, tokenMap: TokenMap): boolean {
    return Object.values(tokenMap).find(entry => coordinatesEqual(entry.coord, coord)) === undefined;
}

export function coordinateInList(coord: Coordinate | undefined, listCoords: (Coordinate | undefined)[]): boolean {
    return !!listCoords.find(entry => entry && coordinatesEqual(entry, coord));
}

export function coordinatesEqual(c1?:Coordinate, c2?: Coordinate):boolean {
    if (!c1 || !c2) return false;
    return c1.x === c2.x && c1.y === c2.y  && c1.grid.id === c2.grid.id;
}

export function getTokenAtCoordinate(coord: Coordinate, tokenMap: TokenMap): [string, TokenData] | undefined {
    return Object.entries(tokenMap).find(([key, entry]) => {
        return entry.coord && entry.coord.x === coord.x && entry.coord.y === coord.y  && entry.coord.grid.id === coord.grid.id;
    });
}

export function toMove(turn: number, from: Coordinate, to: Coordinate): CoordinateMove {
    return {
        turn,
        from: [from.x, from.y],
        to: [to.x, to.y]
    }
}