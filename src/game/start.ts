import {TokenData, TokenMap, GridData} from "../types";


export function startState(grid: GridData): TokenMap {
    return {
        wp0: new TokenData("pawn", 0, {x:0, y:6, grid }),
        wp1: new TokenData("pawn", 0, {x:1, y:6, grid }),
        wp2: new TokenData("pawn", 0,  {x:2, y:6, grid }),
        wp3: new TokenData("pawn", 0,  {x:3, y:6, grid }),
        wp4: new TokenData("pawn", 0,  {x:4, y:6, grid }),
        wp5: new TokenData("pawn", 0,  {x:5, y:6, grid }),
        wp6: new TokenData("pawn", 0,  {x:6, y:6, grid }),
        wp7: new TokenData("pawn", 0,  {x:7, y:6, grid }),
        wb1: new TokenData("bishop", 0,  {x:2, y:7, grid }),
        wb2: new TokenData("bishop", 0,  {x:5, y:7, grid }),
        wn1: new TokenData("knight", 0,  {x:1, y:7, grid }),
        wn2: new TokenData("knight", 0,  {x:6, y:7, grid }),
        wr1: new TokenData("rook", 0,  {x:0, y:7, grid }),
        wr2: new TokenData("rook", 0,  {x:7, y:7, grid }),
        wq1: new TokenData("queen", 0,  {x:3, y:7, grid }),
        wk1: new TokenData("king", 0,  {x:4, y:7, grid }),
        bp0: new TokenData("pawn", 1,  {x:0, y:1, grid }),
        bp1: new TokenData("pawn", 1,  {x:1, y:1, grid }),
        bp2: new TokenData("pawn", 1,  {x:2, y:1, grid }),
        bp3: new TokenData("pawn", 1,  {x:3, y:1, grid }),
        bp4: new TokenData("pawn", 1,  {x:4, y:1, grid }),
        bp5: new TokenData("pawn", 1,  {x:5, y:1, grid }),
        bp6: new TokenData("pawn", 1,  {x:6, y:1, grid }),
        bp7: new TokenData("pawn", 1,  {x:7, y:1, grid }),
        bb1: new TokenData("bishop", 1,  {x:2, y:0, grid }),
        bb2: new TokenData("bishop", 1,  {x:5, y:0, grid }),
        bn1: new TokenData("knight", 1,  {x:1, y:0, grid }),
        bn2: new TokenData("knight", 1,  {x:6, y:0, grid }),
        br1: new TokenData("rook", 1,  {x:0, y:0, grid }),
        br2: new TokenData("rook", 1,  {x:7, y:0, grid }),
        bq1: new TokenData("queen", 1,  {x:3, y:0, grid }),
        bk1: new TokenData("king", 1,  {x:4, y:0, grid})
        }
    }

