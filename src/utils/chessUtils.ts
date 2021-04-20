import {TokenData, TokenMap, Coordinate} from "../types";
import {emptyCoordinate, pieceOfColorAtCoordinate} from "./index";

export function getOpponent(player: number) {
    return player ? 0 : 1;
}

export function playerFlip(player: number): number {
    return player ? -1 : 1;
}

export function makeLine(xDelta: number, yDelta: number, token: TokenData, tokenMap: TokenMap): Coordinate[] {
    const moves: Coordinate[] = [];
    if (!token.coord) return moves;
    let current: Coordinate = {x: token.coord.x + xDelta, y: token.coord.y + yDelta, grid: token.coord.grid};
    while (emptyCoordinate(current, tokenMap) && token.coord.grid.coordinateInGridBounds(current)) {
        moves.push(current);
        current = {x: current.x + xDelta, y: current.y + yDelta, grid: token.coord.grid};
    }
    if (pieceOfColorAtCoordinate(current, getOpponent(token.player), tokenMap)) moves.push(current);

    return moves;
}

export function makeJump(xDelta: number, yDelta:number, coord: Coordinate, blockingPlayer: number, tokenMap: TokenMap): Coordinate[] {
    const newCoord = {x: coord.x + xDelta, y:coord.y + yDelta, grid: coord.grid};
    return !pieceOfColorAtCoordinate(newCoord, blockingPlayer, tokenMap) ? [newCoord] : [];
}

export function maybeCaptureTokenOfColorAtCoordinate(coord: Coordinate, capturePlayer: number, tokenMap: TokenMap): TokenMap {
    const capture = Object.entries(tokenMap).find(([key, entry]) => {
        return entry.player === capturePlayer && entry.coord && entry.coord.x === coord.x && entry.coord.y === coord.y  && entry.coord.grid.id === coord.grid.id
    });
    if (!capture) return tokenMap;
    delete tokenMap[capture[0]];
    return tokenMap;
}

export function inLegalCells(legalCells: Coordinate[], x: number, y: number): boolean {
    return !!legalCells.find(c => c.x === x && c.y === y);
}