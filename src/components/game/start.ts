import {Pawn, Bishop, Knight, Rook, King, Queen} from "./piece";
import {white, black} from "./players";
import {TokenMap} from "../../types";
import {GridProps} from "../grid";


export function startState(grid: GridProps): TokenMap {
    return {
    wp0: { coord: {x:1, y:7, grid}, piece: Pawn, color: white},
    wp1: { coord: {x:2, y:7, grid}, piece: Pawn, color: white},
    wp2: { coord: {x:3, y:7, grid}, piece: Pawn, color: white},
    wp3: { coord: {x:4, y:7, grid}, piece: Pawn, color: white},
    wp4: { coord: {x:5, y:7, grid}, piece: Pawn, color: white},
    wp5: { coord: {x:6, y:7, grid}, piece: Pawn, color: white},
    wp6: { coord: {x:7, y:7, grid}, piece: Pawn, color: white},
    wp7: { coord: {x:8, y:7, grid}, piece: Pawn, color: white},
    wb1: { coord: {x:3, y:8, grid}, piece: Bishop, color: white},
    wb2: { coord: {x:6, y:8, grid}, piece: Bishop, color: white},
    wn1: { coord: {x:2, y:8, grid}, piece: Knight, color: white},
    wn2: { coord: {x:7, y:8, grid}, piece: Knight, color: white},
    wr1: { coord: {x:1, y:8, grid}, piece: Rook, color: white},
    wr2: { coord: {x:8, y:8, grid}, piece: Rook, color: white},
    wq1: { coord: {x:5, y:8, grid}, piece: Queen, color: white},
    wk1: { coord: {x:4, y:8, grid}, piece: King, color: white},

    bp0: { coord: {x:1, y:2, grid}, piece: Pawn, color: black},
    bp1: { coord: {x:2, y:2, grid}, piece: Pawn, color: black},
    bp2: { coord: {x:3, y:2, grid}, piece: Pawn, color: black},
    bp3: { coord: {x:4, y:2, grid}, piece: Pawn, color: black},
    bp4: { coord: {x:5, y:2, grid}, piece: Pawn, color: black},
    bp5: { coord: {x:6, y:2, grid}, piece: Pawn, color: black},
    bp6: { coord: {x:7, y:2, grid}, piece: Pawn, color: black},
    bp7: { coord: {x:8, y:2, grid}, piece: Pawn, color: black},
    bb1: { coord: {x:3, y:1, grid}, piece: Bishop, color: black},
    bb2: { coord: {x:6, y:1, grid}, piece: Bishop, color: black},
    bn1: { coord: {x:2, y:1, grid}, piece: Knight, color: black},
    bn2: { coord: {x:7, y:1, grid}, piece: Knight, color: black},
    br1: { coord: {x:1, y:1, grid}, piece: Rook, color: black},
    br2: { coord: {x:8, y:1, grid}, piece: Rook, color: black},
    bq1: { coord: {x:5, y:1, grid}, piece: Queen, color: black},
    bk1: { coord: {x:4, y:1, grid}, piece: King, color: black},}

}