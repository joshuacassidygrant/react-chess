import {Coordinate} from "./coordinate";
import {Position} from "./position";
import {Piece} from "../components/game/piece";
import {getPositionFromCoordinates} from "../components/grid";

export type TokenData = {
    coord?: Coordinate,
    pos?: Position
    piece: Piece,
    color: string
}

export interface TokenMap {
    [id: string]: TokenData
}

export function getPosition(token: TokenData): Position {
    if (token.coord) return getPositionFromCoordinates(token.coord);
    if (token.pos) return token.pos;
    return {x: 0, y: 0}; 
}