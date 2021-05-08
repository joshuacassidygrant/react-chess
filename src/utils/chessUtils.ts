import { TokenData, TokenMap, Coordinate, CoordinateMove, GridData } from "../types";
import { GameState } from "../types/gameState";
import { crd, emptyCoordinate, pieceOfColorAtCoordinate, getTokenAtCoordinate, updateTokenData, coordinateInList } from "./index";
import { forecastTokenData } from "./tokenMapUtils";

export function getOpponent(player: number) {
    return player ? 0 : 1;
}

export function playerFlip(player: number): number {
    return player ? -1 : 1;
}

export function makeLine(xDelta: number, yDelta: number, token: TokenData, tokenMap: TokenMap): Coordinate[] {
    const moves: Coordinate[] = [];
    if (!token.coord) return moves;
    let current: Coordinate = { x: token.coord.x + xDelta, y: token.coord.y + yDelta, grid: token.coord.grid };
    while (emptyCoordinate(current, tokenMap) && token.coord.grid.coordinateInGridBounds(current)) {
        moves.push(current);
        current = { x: current.x + xDelta, y: current.y + yDelta, grid: token.coord.grid };
    }
    if (pieceOfColorAtCoordinate(current, getOpponent(token.player), tokenMap)) moves.push(current);

    return moves;
}

export function makeJump(xDelta: number, yDelta: number, coord: Coordinate, blockingPlayer: number, tokenMap: TokenMap): Coordinate[] {
    const newCoord = { x: coord.x + xDelta, y: coord.y + yDelta, grid: coord.grid };
    return !pieceOfColorAtCoordinate(newCoord, blockingPlayer, tokenMap) ? [newCoord] : [];
}

export function inLegalCells(legalCells: Coordinate[], x: number, y: number): boolean {
    return !!legalCells.find(c => c.x === x && c.y === y);
}

export function doMove(move: CoordinateMove, grid: GridData, tokenMap: TokenMap): TokenMap {
    const token = getTokenAtCoordinate({ x: move.from[0], y: move.from[1], grid }, tokenMap);
    if (!token) return tokenMap;
    

    // Capture
    const capture: [string,TokenData]|undefined = getTokenAtCoordinate({x: move.to[0], y: move.to[1], grid}, tokenMap);
    if (capture && capture[1].player !== token[1].player) {
        delete tokenMap[capture[0]]
    }

    const tokenData = token[1];
    const tokenUpdate = tokenData.setCoordAndReturn({ x: move.to[0], y: move.to[1], grid });

    // Promotion
    if (tokenUpdate.pieceKey === "pawn" && ((tokenUpdate.player === 0 && tokenUpdate.coord?.y === 0) || (tokenUpdate.player === 1 && tokenUpdate.coord?.y === 7))) {
        tokenUpdate.pieceKey = "queen"; // TODO -- allow promotion choice
    }

    tokenUpdate.hasMoved = true;
    tokenMap = updateTokenData(tokenMap, { [token[0]]: tokenUpdate});

    return tokenMap;
}

export function roleToName(roleNumber: number): string {
    const roles: string[] = ["White", "Black", "Spectator"];
    if (!(roleNumber in roles)) return "None";
    return roles[roleNumber];
}

export function checkedColors(tokenMap: TokenMap): number[] {
    const blackKingCoord = tokenMap.bk1?.coord;
    const whiteKingCoord = tokenMap.wk1?.coord;

    if (!blackKingCoord || !whiteKingCoord) {
        return [];
    }

    return [
        ...Object.entries(tokenMap).some(e => e[1].player === 1 && coordinateInList(whiteKingCoord, e[1].getPiece().getLegalMoves(e[0], tokenMap))) ? [0] : [],
        ...Object.entries(tokenMap).some(e => e[1].player === 0 && coordinateInList(blackKingCoord, e[1].getPiece().getLegalMoves(e[0], tokenMap))) ? [1] : [],
    ];
}

export function tileUnderThreatOrOccupied(tokenMap: TokenMap, coord: Coordinate, threatenedPlayer: number): boolean {
    return emptyCoordinate(coord, tokenMap) || Object.entries(tokenMap).some(e => e[1].player !== threatenedPlayer && coordinateInList(coord, e[1].getPiece().getLegalMoves(e[0], tokenMap)))
}

export function filterIllegalMoves(tokenMap: TokenMap, tokenId: string, tokenData: TokenData, coords: Coordinate[]): Coordinate[] {
    // remove any move that would put token off board
    if (!tokenData.coord) return [];
    const grid = tokenData.coord?.grid;

    coords = coords.filter(c => grid.coordinateInGridBounds(c));
    
    // remove any move that  would put self in check
    const testToken = new TokenData(tokenData.pieceKey, tokenData.player, tokenData.coord);
    return coords.filter(c => !checkedColors(forecastTokenData({ ...tokenMap }, { [tokenId]: testToken.setCoordAndReturn(c) })).includes(tokenData.player));
}

export function getLegalMoves(tokenId: string, tokenMap: TokenMap, grid: GridData): Coordinate[] {
    const token = tokenMap[tokenId];
    if (!token) {
        throw Error(`No piece with id ${tokenId}`);
    }
    return filterIllegalMoves(tokenMap, tokenId, token, [...token.getPiece().getLegalMoves(tokenId, tokenMap), ...token.getPiece().getSpecialMoves(tokenId, tokenMap).map(m => m[0])
    ]);
}

export function generateCastlingMoves(tokenId: string, tokenMap: TokenMap): [Coordinate, [Coordinate, Coordinate][]][] {
    const token = tokenMap[tokenId];
    if (!token.coord || token.pieceKey !== "king") return [];
    const grid = token.coord.grid;

    // Check if checked or moved
    if (token.hasMoved || checkedColors(tokenMap).includes(token.player)) return []
    const moves:[Coordinate, [Coordinate, Coordinate][]][] = [];

    // Choose player
    if (token.player === 0) {
        // Choose a rook
        if ("wr1" in tokenMap && !tokenMap.wr1.hasMoved 
            && !tileUnderThreatOrOccupied(tokenMap, crd(2, 7, grid), 0)
            && !tileUnderThreatOrOccupied(tokenMap, crd(3, 7, grid), 0))
            {
                moves.push([crd(2,7, grid), [[crd(0, 7, grid), crd(3,7, grid)], [crd(4,7,grid), crd(2,7, grid)]]])
            }
        

        if ("wr2" in tokenMap && !tokenMap.wr2.hasMoved
            // Check if passing and king ending squares threatened TODO
            && !tileUnderThreatOrOccupied(tokenMap, crd(5, 7, grid), 0)
            && !tileUnderThreatOrOccupied(tokenMap, crd(6, 7, grid), 0))
            {
                moves.push([crd(5,7, grid), [[crd(4, 7, grid), crd(6,7, grid)], [crd(7,7,grid), crd(5,7, grid)]]])
        }
        
    } else if (token.player === 1) {
        if ("br1" in tokenMap) {
            if (!tokenMap.br1.hasMoved
            && !tileUnderThreatOrOccupied(tokenMap, crd(2, 0, grid), 1) 
            && !tileUnderThreatOrOccupied(tokenMap, crd(3, 0, grid), 1))
            {
                moves.push([crd(2,0, grid), [[crd(0, 0, grid), crd(3,0, grid)], [crd(4,0,grid), crd(2,0, grid)]]])
            }
        }

        if ("br2" in tokenMap) {
            if (!tokenMap.br2.hasMoved
            && !tileUnderThreatOrOccupied(tokenMap, crd(2, 0, grid), 1) 
            && !tileUnderThreatOrOccupied(tokenMap, crd(3, 0, grid), 1))
            {
                moves.push([crd(3,0, grid), [[crd(0, 0, grid), crd(3,0, grid)], [crd(4,0,grid), crd(2,0, grid)]]])
            }
        }

    }

    return moves;
}

export function checkGameState(state: GameState, tokenMap: TokenMap, grid: GridData): GameState {
    if (state === GameState.NOT_STARTED) return GameState.PLAYING;

    if (checkedColors(tokenMap).includes(0)) {
        // White is checked; check for checkmate
        if (Object.entries(tokenMap)
            .filter(e => e[1].player === 0)
            .every(e => filterIllegalMoves(tokenMap, e[0], e[1], e[1].getPiece().getLegalMoves(e[0], tokenMap)).length === 0)) {
            return GameState.BLACK_WINS;
        }
    }

    if (checkedColors(tokenMap).includes(1)) {
        // Black is checked; check for checkmate
        if (Object.entries(tokenMap)
            .filter(e => e[1].player === 1)
            .every(e => filterIllegalMoves(tokenMap, e[0], e[1], e[1].getPiece().getLegalMoves(e[0], tokenMap)).length === 0)) {
            return GameState.WHITE_WINS;
        }

    }
    // TODO stalemate


    return GameState.PLAYING;
    // TODO
}