import {Coordinate} from "./coordinate";
import {Piece} from "../components/game/piece";

export type TokenData = {
    coord: Coordinate,
    piece: Piece,
    color: string
}

export interface TokenMap {
    [id: string]: TokenData
}