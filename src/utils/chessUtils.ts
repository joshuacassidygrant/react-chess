import { TokenData, TokenMap, Coordinate, CoordinateMove, GridData } from "../types";
import { GameState } from "../types/gameState";
import { emptyCoordinate, pieceOfColorAtCoordinate, getTokenAtCoordinate, removeTokenData, updateTokenData, coordinateInList } from "./index";

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

export function maybeCaptureTokenOfColorAtCoordinate(coord: Coordinate, capturePlayer: number, tokenMap: TokenMap): TokenMap {
    const capture = Object.entries(tokenMap).find(([key, entry]) => {
        return entry.player === capturePlayer && entry.coord && entry.coord.x === coord.x && entry.coord.y === coord.y && entry.coord.grid.id === coord.grid.id
    });
    if (!capture) return tokenMap;
    delete tokenMap[capture[0]];
    return tokenMap;
}

export function inLegalCells(legalCells: Coordinate[], x: number, y: number): boolean {
    return !!legalCells.find(c => c.x === x && c.y === y);
}

export function doMove(move: CoordinateMove, grid: GridData, tokenMap: TokenMap): TokenMap {
    const token = getTokenAtCoordinate({ x: move.from[0], y: move.from[1], grid }, tokenMap);
    if (!token) return tokenMap;
    const tokenData = token[1];
    const captureToken = getTokenAtCoordinate({ x: move.to[0], y: move.to[1], grid }, tokenMap);
    if (captureToken !== undefined && captureToken[1].player === getOpponent(tokenData.player)) {
        tokenMap = removeTokenData(tokenMap, captureToken[0]);
    }
    tokenMap = updateTokenData(tokenMap, { [token[0]]: tokenData.setCoordAndReturn({ x: move.to[0], y: move.to[1], grid }) });

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
        ...Object.entries(tokenMap).some(e => e[1].player === 1 && coordinateInList(whiteKingCoord, e[1].getPiece().getLegalMoves(e[0], tokenMap, grid))) ? [0] : [],
        ...Object.entries(tokenMap).some(e => e[1].player === 0 && coordinateInList(blackKingCoord, e[1].getPiece().getLegalMoves(e[0], tokenMap, grid))) ? [1] : [],
    ];
}

export function filterIllegalMoves(tokenMap: TokenMap, tokenId: string, tokenData: TokenData, coords: Coordinate[]): Coordinate[] {
    // remove any move that would put token off board
    if (tokenData.coord) {
        const grid = tokenData.coord.grid;
        coords = coords.filter(c => grid.coordinateInGridBounds(c));
    }
    // remove any move that  would put self in check
    const testToken = new TokenData(tokenData.pieceKey, tokenData.player, tokenData.coord);
    return coords.filter(c => !checkedColors(updateTokenData({ ...tokenMap }, { [tokenId]: testToken.setCoordAndReturn(c) })).includes(tokenData.player));

}

export function checkGameState(state: GameState, tokenMap: TokenMap): GameState {
    if (state === GameState.NOT_STARTED) return GameState.PLAYING;
    const blackKingCoord = tokenMap.bk1.coord;

    if (!blackKingCoord) {
        console.log("Missing king.");
        return GameState.ERROR;
    }

    const grid = blackKingCoord.grid;
    if (checkedColors(tokenMap).includes(0)) {
        // White is checked; check for checkmate
        if (Object.entries(tokenMap)
            .filter(e => e[1].player === 0)
            .every(e => filterIllegalMoves(tokenMap, e[0], e[1], e[1].getPiece().getLegalMoves(e[0], tokenMap, grid)).length === 0)) {
            return GameState.BLACK_WINS;
        }
    }

    if (checkedColors(tokenMap).includes(1)) {
        // Black is checked; check for checkmate
        if (Object.entries(tokenMap)
            .filter(e => e[1].player === 1)
            .every(e => filterIllegalMoves(tokenMap, e[0], e[1], e[1].getPiece().getLegalMoves(e[0], tokenMap, grid)).length === 0)) {
            return GameState.WHITE_WINS;
        }

    }
    // TODO stalemate


    return GameState.PLAYING;
    // TODO
}