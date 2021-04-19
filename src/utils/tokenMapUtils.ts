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