import {white, black} from "../game/players";
import {TokenData, TokenMap, Coordinate} from "../types";
import {emptyCoordinate, coordinateInGridBounds, pieceOfColorAtCoordinate} from "./index";

export function getOpponent(color: string) {
    return color === white ? black : white;
}

export function colorFlip(color: string): number {
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