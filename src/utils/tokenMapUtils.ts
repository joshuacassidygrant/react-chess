import {white, getOpponent} from "../components/game/players";
import {Coordinate, TokenMap, TokenData} from "../types";
import {coordinateInGridBounds} from "../components/grid"


export function pieceOfColorAtCoordinate(coord: Coordinate, color: string, tokenMap: TokenMap): boolean {
    return Object.values(tokenMap).find(entry => entry.color === color && entry.coord && entry.coord.x === coord.x && entry.coord.y === coord.y  && entry.coord.grid.id === coord.grid.id) !== undefined;
}

export function emptyCoordinate(coord: Coordinate, tokenMap: TokenMap): boolean {
    return Object.values(tokenMap).find(entry => entry.coord && entry.coord.x === coord.x && entry.coord.y === coord.y && entry.coord.grid.id === coord.grid.id) === undefined;
}

export function cFlip(color: string): number {
    return color === white ? 1 : -1;
}

export function makeLine(xDelta: number, yDelta: number, token: TokenData, tokenMap: TokenMap): Coordinate[] {
    const moves: Coordinate[] = [];
    if (!token.coord) return moves;
    let current: Coordinate = {x: token.coord.x + xDelta, y: token.coord.y + yDelta, grid: token.coord.grid};
    while (emptyCoordinate(current, tokenMap) && coordinateInGridBounds(current)) {
        moves.push(current);
        current = {x: current.x + xDelta, y: current.y + yDelta, grid: token.coord.grid};
    }
    if (pieceOfColorAtCoordinate(current, getOpponent(token.color), tokenMap)) moves.push(current);

    return moves;
}

export function makeJump(xDelta: number, yDelta:number, coord: Coordinate, blockingColor: string, tokenMap: TokenMap): Coordinate[] {
    const newCoord = {x: coord.x + xDelta, y:coord.y + yDelta, grid: coord.grid};
    return !pieceOfColorAtCoordinate(newCoord, blockingColor, tokenMap) ? [newCoord] : [];
}

export function maybeCaptureTokenOfColorAtCoordinate(coord: Coordinate, captureColor: string, tokenMap: TokenMap): TokenMap {
    const capture = Object.entries(tokenMap).find(([key, entry]) => {
        return entry.color === captureColor && entry.coord && entry.coord.x === coord.x && entry.coord.y === coord.y  && entry.coord.grid.id === coord.grid.id
    });
    if (!capture) return tokenMap;
    delete tokenMap[capture[0]];
    return tokenMap;
}

export function updateTokenData(map: TokenMap, changes: TokenMap): TokenMap {
    return {...map, ...changes};
}