import { Coordinate, coordinateSort, GridData, TokenData, TokenMap } from "../../types";
import {startState} from "../start";
import {getLegalMoves} from "../../utils/chessUtils";

const xWidthCells:number = 8;
const yHeightCells:number = 8;
const height:number = 600;
const width:number = 600;
const grid = new GridData("chessGrid", height, width, xWidthCells, yHeightCells);

// Utility:
function expectLegalMoves(tokenId: string, tokenMap: TokenMap, grid: GridData, expectedCells: Coordinate[]) {
    expect(getLegalMoves(tokenId, tokenMap, grid).sort(coordinateSort)).toEqual(expectedCells.sort(coordinateSort));
}

// From start state:
const start = startState(grid);

test("white pawn initial state moves", () => {
    for (let i = 0; i < 8; i++) {
        let id = "wp" + i;

        expectLegalMoves(id, start, grid, [{x: i, y:4, grid}, {x: i, y:5, grid}]);
    }
})

test("black pawn initial state moves", () => {
    for (let i = 0; i < 8; i++) {
        let id = "bp" + i;
        expectLegalMoves(id, start, grid, [{x: i, y:2, grid}, {x: i, y:3, grid}]);
    }
})

test("knight initial state moves", () => {
    expectLegalMoves("wn1", start, grid, [{x: 0, y:5, grid}, {x: 2, y:5, grid}]);
    expectLegalMoves("wn2", start, grid, [{x: 5, y:5, grid}, {x: 7, y:5, grid}]);
    expectLegalMoves("bn1", start, grid, [{x: 0, y:2, grid}, {x: 2, y:2, grid}]);
    expectLegalMoves("bn2", start, grid, [{x: 5, y:2, grid}, {x: 7, y:2, grid}]);
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
        wp1: new TokenData("pawn", 0, {x:1, y:6, grid }),
        bp1: new TokenData("pawn", 1, {x:0, y:5, grid }),
        bp2: new TokenData("pawn", 1, {x:1, y:5, grid }),
        bp3: new TokenData("pawn", 1, {x:2, y:5, grid }),
    }

    expectLegalMoves("wp1", tokenMap, grid, [{x: 0, y: 5, grid}, {x:2, y:5, grid }]);
})

test("pawn movement: post move", () => {
    const movedPawn = new TokenData("pawn", 0, {x: 4, y: 5, grid});
    movedPawn.hasMoved = true;

    const tokenMap: TokenMap = {
        wp1: movedPawn
    }

    expectLegalMoves("wp1", tokenMap, grid, [{x:4, y: 4, grid}]);
});

test("pawn movement: blocked start", () => {
    const tokenMap: TokenMap = {
        wp1: new TokenData("pawn", 0,  {x:6, y:6, grid }),
        bp1: new TokenData("pawn", 1, {x:6, y:4, grid}),
    }
    expectLegalMoves("wp1", tokenMap, grid, [{x:6, y: 5, grid}]);
})


test("pawn movement: can't capture own pieces", () => {
    const tokenMap: TokenMap = {
        wp1: new TokenData("pawn", 0, {x:1, y:6, grid }),
        wp2: new TokenData("pawn", 0, {x:0, y:5, grid }),
    }
    expectLegalMoves("wp1", tokenMap, grid, [{x:1, y: 4, grid}, {x:1, y: 5, grid}]);
});

test("pawn movement: black pawns move down", () => {
    const tokenMap: TokenMap = {...start};

    expectLegalMoves("bp0", tokenMap, grid, [{x: 0, y:2, grid}, {x:0, y:3, grid}]);
})


// BISHOP
test("bishop movement: from center of board",  () => {
    const tokenMap: TokenMap = {...start}
    tokenMap.wb1 = new TokenData(tokenMap.wb1.pieceKey, tokenMap.wb1.player, {x: 6, y:3, grid});

    expectLegalMoves("wb1", tokenMap, grid, [
        {x: 5, y: 2, grid}, {x: 4, y: 1, grid}, {x: 7, y: 2, grid}, {x: 5, y:4, grid}, {x: 4, y:5, grid}, {x: 7, y:4, grid}
    ]);
})

// KNIGHT
test("knight movement on empty board", () =>{
    const tokenMap: TokenMap = {wn1: start.wn1}
    tokenMap.wn1 = new TokenData("knight", 0, {x: 3, y: 3, grid});

    expectLegalMoves("wn1", tokenMap, grid, [
        {x: 1, y: 2, grid}, {x: 1, y:4, grid}, {x: 2, y:5, grid}, {x: 4, y:5, grid}, {x: 5, y:4, grid}, {x: 5, y:2, grid}, {x: 2, y:1, grid}, {x: 4, y:1, grid}
    ]);

    
})

// ROOK
test("rook movement: from center of board", () => {
    const tokenMap: TokenMap = {...start}
    tokenMap.br1 = new TokenData("rook", 1, {x: 3, y: 3, grid});
    expectLegalMoves("br1", tokenMap, grid, [
        {x: 0, y: 3, grid}, {x: 1, y:3, grid}, {x: 2, y:3, grid}, {x: 4, y:3, grid}, {x: 5, y:3, grid}, {x: 6, y:3, grid}, {x: 7, y:3, grid},
        {x: 3, y:4, grid}, {x: 3, y:5, grid}, {x: 3, y:2, grid}, {x: 3, y:6, grid}
    ]);

})

// QUEEN
// TODO

// KING
// TODO


// CHECKS
// TODO

// CASTLING
// TODO

// EN PASSANT
// TODO

// PROMOTION
// TODO