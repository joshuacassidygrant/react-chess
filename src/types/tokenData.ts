import {Coordinate} from "./coordinate";
import {Position} from "./position";
import {Piece} from "../components/game/piece";
import {getPositionFromCoordinates} from "../components/grid";

export interface TokenMap {
    [id: string]: TokenData
}

export class TokenData {
    coord?: Coordinate;
    pos?: Position;
    piece: Piece;
    color: string;

    constructor(piece: Piece, color: string, coord?: Coordinate) { 
        this.piece = piece;
        this.color = color;
        this.coord = coord;
    }

    getPosition(): Position {
        if (this.coord) return getPositionFromCoordinates(this.coord);
        if (this.pos) return this.pos;
        return {x: 0, y: 0}; // TODO hmm
    }

    setPosAndReturn(pos: Position): TokenData {
        this.coord = undefined;
        this.pos = pos;
        return this;
    }

    setCoordAndReturn(coord: Coordinate): TokenData {
        this.pos = undefined;
        this.coord =  coord;
        return this;
    }
}

