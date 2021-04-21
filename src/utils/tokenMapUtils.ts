import {TokenMap} from "../types";

export function updateTokenData(map: TokenMap, changes: TokenMap): TokenMap {
    return {...map, ...changes};
}

export function removeTokenData(map: TokenMap, id: string): TokenMap {
    delete map[id];
    return {...map}
}