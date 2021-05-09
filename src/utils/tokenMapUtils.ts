import { coordinateInList } from ".";
import {CoordinateMove, GridData, TokenMap} from "../types";
import { doMove } from "./chessUtils";

export function updateTokenData(map: TokenMap, changes: TokenMap): TokenMap {
    return {...map, ...changes}
}

export function forecastTokenData(map: TokenMap, changes: TokenMap): TokenMap {
    const newMap = {...map, ...changes}
    const captureKeys: string[] = Object.entries(map).filter(t => coordinateInList(t[1].coord, Object.values(changes).map(t => t.coord).filter(c => c !== undefined)) && !Object.keys(changes).includes(t[0])).map(t => t[0]);
    captureKeys.forEach(k => delete newMap[k])  // TODO BROKEN THIS
    return newMap;
}

export function removeTokenData(map: TokenMap, id: string): TokenMap {
    delete map[id];
    return {...map}
}

export function applyHistory(map: TokenMap, history: CoordinateMove[], grid: GridData): TokenMap {

    history.forEach(move => {
        doMove(move, grid, map)
    })
    return map;
}