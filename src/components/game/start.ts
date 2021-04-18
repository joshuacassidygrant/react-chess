import {Pawn, Bishop, Knight, Rook, King, Queen} from "./piece";
import {white, black} from "./players";


export const startState = {
    wp0: { coord: {x:0, y:6}, piece: Pawn, color: white},
    wp1: { coord: {x:1, y:6}, piece: Pawn, color: white},
    wp2: { coord: {x:2, y:6}, piece: Pawn, color: white},
    wp3: { coord: {x:3, y:6}, piece: Pawn, color: white},
    wp4: { coord: {x:4, y:6}, piece: Pawn, color: white},
    wp5: { coord: {x:5, y:6}, piece: Pawn, color: white},
    wp6: { coord: {x:6, y:6}, piece: Pawn, color: white},
    wp7: { coord: {x:7, y:6}, piece: Pawn, color: white},
    wb1: { coord: {x:2, y:7}, piece: Bishop, color: white},
    wb2: { coord: {x:5, y:7}, piece: Bishop, color: white},
    wn1: { coord: {x:1, y:7}, piece: Knight, color: white},
    wn2: { coord: {x:6, y:7}, piece: Knight, color: white},
    wr1: { coord: {x:0, y:7}, piece: Rook, color: white},
    wr2: { coord: {x:7, y:7}, piece: Rook, color: white},
    wq1: { coord: {x:4, y:7}, piece: Queen, color: white},
    wk1: { coord: {x:3, y:7}, piece: King, color: white},


    bp0: { coord: {x:0, y:1}, piece: Pawn, color: black},
    bp1: { coord: {x:1, y:1}, piece: Pawn, color: black},
    bp2: { coord: {x:2, y:1}, piece: Pawn, color: black},
    bp3: { coord: {x:3, y:1}, piece: Pawn, color: black},
    bp4: { coord: {x:4, y:1}, piece: Pawn, color: black},
    bp5: { coord: {x:5, y:1}, piece: Pawn, color: black},
    bp6: { coord: {x:6, y:1}, piece: Pawn, color: black},
    bp7: { coord: {x:7, y:1}, piece: Pawn, color: black},
    bb1: { coord: {x:2, y:0}, piece: Bishop, color: black},
    bb2: { coord: {x:5, y:0}, piece: Bishop, color: black},
    bn1: { coord: {x:1, y:0}, piece: Knight, color: black},
    bn2: { coord: {x:6, y:0}, piece: Knight, color: black},
    br1: { coord: {x:0, y:0}, piece: Rook, color: black},
    br2: { coord: {x:7, y:0}, piece: Rook, color: black},
    bq1: { coord: {x:4, y:0}, piece: Queen, color: black},
    bk1: { coord: {x:3, y:0}, piece: King, color: black},

}