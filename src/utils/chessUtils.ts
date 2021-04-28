import {TokenData, TokenMap, Coordinate, CoordinateMove, GridData} from "../types";
import {emptyCoordinate, pieceOfColorAtCoordinate, getTokenAtCoordinate, removeTokenData, updateTokenData, coordinateInList} from "./index";

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

export function doMove(move: CoordinateMove, grid: GridData, tokenMap: TokenMap, addTakenPiece: (d: TokenData) => void): TokenMap {
    const token = getTokenAtCoordinate({x: move.from[0], y: move.from[1], grid}, tokenMap);
    if(!token) return tokenMap;
    const tokenData = token[1];
    const captureToken = getTokenAtCoordinate({x: move.to[0], y: move.to[1], grid}, tokenMap);
    if (captureToken !== undefined && captureToken[1].player === getOpponent(tokenData.player)) {
        tokenMap = removeTokenData(tokenMap, captureToken[0]);
        addTakenPiece(captureToken[1]);
    }
    tokenMap = updateTokenData(tokenMap, {[token[0]]: tokenData.setCoordAndReturn({x: move.to[0], y: move.to[1], grid})});

    return tokenMap;
}

export function roleToName(roleNumber: number): string {
    const roles: string[] = ["White", "Black", "Spectator"];
    if (!(roleNumber in roles)) return "None";
    return roles[roleNumber];
}

export function checkedColors(tokenMap: TokenMap): number[] {
    const blackKingCoord = tokenMap.bk1.coord;
    const whiteKingCoord = tokenMap.wk1.coord;

    if (!blackKingCoord || !whiteKingCoord) {
        console.log("Missing king.");
        return [];
    }

    const grid = blackKingCoord.grid;

    return [
        ...Object.entries(tokenMap).some(e => e[1].player === 1 && coordinateInList(whiteKingCoord, e[1].piece.getLegalMoves(e[0], tokenMap, grid))) ? [0] : [],
        ...Object.entries(tokenMap).some(e => e[1].player === 0 && coordinateInList(blackKingCoord, e[1].piece.getLegalMoves(e[0], tokenMap, grid))) ? [1] : [],
    ];
}