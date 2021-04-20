import {Coordinate, Position} from "./index";
import {Piece} from "../game/piece";

export interface TokenMap {
    [id: string]: TokenData
}

export class TokenData {
    coord?: Coordinate;
    pos?: Position;
    piece: Piece;
    player: number;
    isSelected: boolean;

    constructor(piece: Piece, player: number, coord?: Coordinate) { 
        this.piece = piece;
        this.player = player;
        this.coord = coord;
        this.isSelected = false;
    }

    getPosition(): Position {
        if (this.isSelected && this.pos) return this.pos;
        if (this.coord) return this.coord.grid.getPositionFromCoordinates(this.coord);
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

