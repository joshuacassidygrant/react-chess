import {TokenMap} from "../types";

export function updateTokenData(map: TokenMap, changes: TokenMap): TokenMap {
    return {...map, ...changes};
}