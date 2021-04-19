import {white} from "../components/game/players";
import {Coordinate, TokenMap} from "../types";

export function pieceOfColorAtCoordinate(coord: Coordinate, color: string, tokenMap: TokenMap): boolean {
    return Object.values(tokenMap).find(entry => entry.color === color && entry.coord && entry.coord.x === coord.x && entry.coord.y === coord.y  && entry.coord.grid.id === coord.grid.id) !== undefined;
}

export function emptyCoordinate(coord: Coordinate, tokenMap: TokenMap): boolean {
    return Object.values(tokenMap).find(entry => entry.coord && entry.coord.x === coord.x && entry.coord.y === coord.y && entry.coord.grid.id === coord.grid.id) === undefined;
}

export function cFlip(color: string): number {
    return color === white ? 1 : -1;
}