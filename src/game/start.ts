import {Pawn, Bishop, Knight, Rook, King, Queen} from "./piece";
import {white, black} from "./players";
import {TokenData, TokenMap, GridData} from "../types";


export function startState(grid: GridData): TokenMap {
    return {
        wp0: new TokenData(Pawn, white, {x:0, y:6, grid }),
        wp1: new TokenData(Pawn, white, {x:1, y:6, grid }),
        wp2: new TokenData(Pawn, white,  {x:2, y:6, grid }),
        wp3: new TokenData(Pawn, white,  {x:3, y:6, grid }),
        wp4: new TokenData(Pawn, white,  {x:4, y:6, grid }),
        wp5: new TokenData(Pawn, white,  {x:5, y:6, grid }),
        wp6: new TokenData(Pawn, white,  {x:6, y:6, grid }),
        wp7: new TokenData(Pawn, white,  {x:7, y:6, grid }),
        wb1: new TokenData(Bishop, white,  {x:2, y:7, grid }),
        wb2: new TokenData(Bishop, white,  {x:5, y:7, grid }),
        wn1: new TokenData(Knight, white,  {x:1, y:7, grid }),
        wn2: new TokenData(Knight, white,  {x:6, y:7, grid }),
        wr1: new TokenData(Rook, white,  {x:0, y:7, grid }),
        wr2: new TokenData(Rook, white,  {x:7, y:7, grid }),
        wq1: new TokenData(Queen, white,  {x:4, y:7, grid }),
        wk1: new TokenData(King, white,  {x:3, y:7, grid }),
        bp0: new TokenData(Pawn, black,  {x:0, y:1, grid }),
        bp1: new TokenData(Pawn, black,  {x:1, y:1, grid }),
        bp2: new TokenData(Pawn, black,  {x:2, y:1, grid }),
        bp3: new TokenData(Pawn, black,  {x:3, y:1, grid }),
        bp4: new TokenData(Pawn, black,  {x:4, y:1, grid }),
        bp5: new TokenData(Pawn, black,  {x:5, y:1, grid }),
        bp6: new TokenData(Pawn, black,  {x:6, y:1, grid }),
        bp7: new TokenData(Pawn, black,  {x:7, y:1, grid }),
        bb1: new TokenData(Bishop, black,  {x:2, y:0, grid }),
        bb2: new TokenData(Bishop, black,  {x:5, y:0, grid }),
        bn1: new TokenData(Knight, black,  {x:1, y:0, grid }),
        bn2: new TokenData(Knight, black,  {x:6, y:0, grid }),
        br1: new TokenData(Rook, black,  {x:0, y:0, grid }),
        br2: new TokenData(Rook, black,  {x:7, y:0, grid }),
        bq1: new TokenData(Queen, black,  {x:4, y:0, grid }),
        bk1: new TokenData(King, black,  {x:3, y:0, grid})
        }
    }

