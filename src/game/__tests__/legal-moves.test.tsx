import { Coordinate, coordinateSort, GridData, TokenData, TokenMap } from "../../types";
import {startState} from "../start";
import {getLegalMoves, doMove} from "../../utils/chessUtils";
import { toMove } from "../../utils";

const xWidthCells:number = 8;
const yHeightCells:number = 8;
const height:number = 600;
const width:number = 600;
const grid = new GridData("chessGrid", height, width, xWidthCells, yHeightCells);

// Utility:
function expectLegalMoves(tokenId: string, tokenMap: TokenMap, grid: GridData, expectedCells: Coordinate[]) {
    expect(getLegalMoves(tokenId, tokenMap, grid).sort(coordinateSort)).toEqual(expectedCells.sort(coordinateSort));
}

function c(x: number, y: number): Coordinate {
    return {x, y, grid};
}

// From start state:
const start = startState(grid);

test("white pawn initial state moves", () => {
    for (let i = 0; i < 8; i++) {
        let id = "wp" + i;

        expectLegalMoves(id, start, grid, [c(i, 4), c(i, 5)]);
    }
})

test("black pawn initial state moves", () => {
    for (let i = 0; i < 8; i++) {
        let id = "bp" + i;
        expectLegalMoves(id, start, grid, [c(i, 2), c(i, 3)]);
    }
})

test("knight initial state moves", () => {
    expectLegalMoves("wn1", start, grid, [c(0,5), c(2,5)]);
    expectLegalMoves("wn2", start, grid, [c(5,5), c(7,5)]);
    expectLegalMoves("bn1", start, grid, [c(0,2), c(2,2)]);
    expectLegalMoves("bn2", start, grid, [c(5,2), c(7,2)]);
})

test("other piece initial state moves are []", () => {
    const keys = Object.keys(start).filter(k => !(["pawn", "knight"].includes(start[k].pieceKey)));
    for (let key of keys) {
        expectLegalMoves(key, start, grid, []);
    }
})

// Contrived positive move examples


// PAWN
test("pawn movement: blockaded", () => {
    const tokenMap: TokenMap = {
        wp1: new TokenData("pawn", 0, c(1,6)),
        bp1: new TokenData("pawn", 1, c(0,5)),
        bp2: new TokenData("pawn", 1, c(1,5)),
        bp3: new TokenData("pawn", 1, c(2,5)),
    }
    expectLegalMoves("wp1", tokenMap, grid, [c(0,5), c(2,5)]);
})

test("pawn movement: post move", () => {
    const movedPawn = new TokenData("pawn", 0, c(4,5));
    movedPawn.hasMoved = true;
    const tokenMap: TokenMap = {
        wp1: movedPawn
    }
    expectLegalMoves("wp1", tokenMap, grid, [c(4,4)]);
});

test("pawn movement: blocked start", () => {
    const tokenMap: TokenMap = {
        wp1: new TokenData("pawn", 0, c(6,6)),
        bp1: new TokenData("pawn", 1, c(6,4)),
    }
    expectLegalMoves("wp1", tokenMap, grid, [c(6,5)]);
})


test("pawn movement: can't capture own pieces", () => {
    const tokenMap: TokenMap = {
        wp1: new TokenData("pawn", 0, c(1,6)),
        wp2: new TokenData("pawn", 0, c(0,5)),
    }
    expectLegalMoves("wp1", tokenMap, grid, [c(1,4), c(1,5)]);
});

test("pawn movement: black pawns move down", () => {
    const tokenMap: TokenMap = {...start};
    expectLegalMoves("bp0", tokenMap, grid, [c(0,2), c(0,3)]);
})


// BISHOP
test("bishop movement: from center of board",  () => {
    const tokenMap: TokenMap = {...start}
    tokenMap.wb1 = new TokenData(tokenMap.wb1.pieceKey, tokenMap.wb1.player, c(6,3));
    expectLegalMoves("wb1", tokenMap, grid, [
        c(5,2), c(4,1), c(7,2), c(5,4), c(4,5), c(7,4)
    ]);
})

// KNIGHT
test("knight movement on empty board", () =>{
    const tokenMap: TokenMap = {wn1: start.wn1}
    tokenMap.wn1 = new TokenData("knight", 0, c(3,3));
    expectLegalMoves("wn1", tokenMap, grid, [
        c(1,2), c(1,4), c(2,5), c(4,5), c(5,4), c(5,2), c(2,1), c(4,1)
    ]);
})

// ROOK
test("rook movement: from center of board", () => {
    const tokenMap: TokenMap = {...start}
    tokenMap.br1 = new TokenData("rook", 1, c(3,3));
    expectLegalMoves("br1", tokenMap, grid, [
        c(0,3), c(1,3), c(2,3), c(4,3), c(5,3), c(6,3), c(7,3),
        c(3,4), c(3,5), c(3,2), c(3,6)
    ]);
})

// QUEEN
test("queen movement: from center of board", () => {
    const tokenMap: TokenMap = {...start}
    tokenMap.wq1 = new TokenData("queen", 0, c(4,4))
    expectLegalMoves("wq1", tokenMap, grid, [
        c(1,1),  c(4,1), c(7,1),
        c(2,2),  c(4,2), c(6,2),
        c(3,3),  c(4,3), c(5,3),
        c(0,4),  c(1,4), c(2,4), c(3,4), c(5,4), c(6,4), c(7,4),
        c(3,5),  c(4,5), c(5,5),
    ])
});

// KING
test("king movement: from center of board", () => {
    const tokenMap: TokenMap = {...start}
    tokenMap.bk1 = new TokenData("king", 1, c(2,3))
    expectLegalMoves("bk1", tokenMap, grid, [
        c(1,2), c(2,2), c(3,2),
        c(1,3), c(3,3),
        c(1,4), c(2,4), c(3,4)
    ])
});


// CHECKS
test("king cannot move into check", () => {
    const tokenMap: TokenMap = startState(grid);
    tokenMap.bk1 = new TokenData("king", 1, c(0,4))
    expectLegalMoves("bk1", tokenMap, grid, [
        c(0,3), c(1,3), c(1,4)
    ]);
});

test("piece blocking check cannot move out of the way", () => {
    const tokenMap: TokenMap = startState(grid);
    tokenMap.wb1 = new TokenData("bishop", 0, c(7,3));
    expectLegalMoves("bp5", tokenMap, grid, []); 
});


test("can capture piece to break check or block", () => {
    const tokenMap: TokenMap = startState(grid);
    tokenMap.wb1 = new TokenData("bishop", 0, c(7,3));
    tokenMap.br1 = new TokenData("rook", 1, c(7,2));
    tokenMap.bp5 = new TokenData("pawn", 1, c(6,5));
    expectLegalMoves("br1", tokenMap, grid, [c(7,3), c(6,2)]); 
});

test("king can move to  break check", () => {
    const tokenMap: TokenMap = startState(grid);
    tokenMap.wk1 = new TokenData("king", 0, c(7,3));
    tokenMap.br1 = new TokenData("rook", 1, c(5,3));
    expectLegalMoves("wk1", tokenMap, grid, [c(6,4), c(7,4)]);
});

test("checkmate: fools gambit", () => {
    const tokenMap: TokenMap = startState(grid);
    doMove(toMove(0, c(5,6), c(5,5)), grid, tokenMap);
    doMove(toMove(1, c(4,1), c(4,3)), grid, tokenMap);
    doMove(toMove(0, c(6,6), c(6,4)), grid, tokenMap);
    doMove(toMove(0, c(3,0), c(7,4)), grid, tokenMap);

    Object.keys(tokenMap).filter(k => tokenMap[k].player === 0).forEach((k) => {
        expectLegalMoves(k, tokenMap, grid, []);
    });
})

// CASTLING
test("castling: white queenside", () => {

    const tokenMap: TokenMap = startState(grid);
    delete tokenMap.wn1;
    delete tokenMap.wb1;
    delete tokenMap.wq1;
    
    expectLegalMoves("wk1", tokenMap, grid, [c(3,7), c(2,7)]);

})


test("castling: white kingside", () => {

    const tokenMap: TokenMap = startState(grid);
    delete tokenMap.wn2;
    delete tokenMap.wb2;
    
    expectLegalMoves("wk1", tokenMap, grid, [c(5,7), c(6,7)]);

})



test("castling: black queenside", () => {

    const tokenMap: TokenMap = startState(grid);
    delete tokenMap.bn1;
    delete tokenMap.bb1;
    delete tokenMap.bq1;
    
    expectLegalMoves("bk1", tokenMap, grid, [c(3,0), c(2,0)]);

})


test("castling: black kingside", () => {

    const tokenMap: TokenMap = startState(grid);
    delete tokenMap.bn2;
    delete tokenMap.bb2;
    
    expectLegalMoves("bk1", tokenMap, grid, [c(5,0), c(6,0)]);

})

// EN PASSANT
test ("en passant white pawn", () => {
    const tokenMap: TokenMap = startState(grid);
    doMove(toMove(0, c(2,6), c(2,3)), grid, tokenMap);
    doMove(toMove(1, c(3,1), c(3,3)), grid, tokenMap);

    expectLegalMoves("wp2", tokenMap, grid, [c(2,2), c(3,2)]);
})

test ("en passant black pawn", () => {
    const tokenMap: TokenMap = startState(grid);
    doMove(toMove(1, c(3,1), c(3,4)), grid, tokenMap);
    doMove(toMove(0, c(2,6), c(2,4)), grid, tokenMap);

    expectLegalMoves("bp3", tokenMap, grid, [c(3,5), c(2,5)]);
})

// PROMOTION
// TODO

// STALEMATE
// TODO