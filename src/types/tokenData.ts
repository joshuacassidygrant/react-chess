import {Coordinate, Position} from "./index";
import {Piece, PieceMap} from "../game/piece";

export interface TokenMap {
    [id: string]: TokenData
}

export class TokenData {
    coord?: Coordinate;
    pos?: Position;
    pieceKey: string;
    player: number;
    isSelected: boolean;
    hasMoved: boolean;


    constructor(pieceKey: string, player: number, coord?: Coordinate) { 
        this.pieceKey = pieceKey;
        this.player = player;
        this.coord = coord;
        this.isSelected = false;
        this.hasMoved = false;
        
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

    getPiece() : Piece {
        const piece = PieceMap.get(this.pieceKey);
        if (!piece) {
            throw new Error(`No piece for key ${this.pieceKey}`);
        }
        return piece;
    }
}

