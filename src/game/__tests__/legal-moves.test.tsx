import { coordinateSort, GridData, TokenData, TokenMap } from "../../types";
import {startState} from "../start";
import {getLegalMoves} from "../../utils/chessUtils";

const xWidthCells:number = 8;
const yHeightCells:number = 8;
const height:number = 600;
const width:number = 600;
const grid = new GridData("chessGrid", height, width, xWidthCells, yHeightCells);


// From start state:
const start = startState(grid);

test("white pawn initial state moves", () => {
    for (let i = 0; i < 8; i++) {
        let id = "wp" + i;
        const cells = getLegalMoves(id, start, grid);
        expect(cells.sort(coordinateSort)).toEqual([{x: i, y:4, grid}, {x: i, y:5, grid}].sort(coordinateSort));
    }
})

test("black pawn initial state moves", () => {
    for (let i = 0; i < 8; i++) {
        let id = "bp" + i;
        const cells = getLegalMoves(id, start, grid);
        expect(cells.sort(coordinateSort)).toEqual([{x: i, y:2, grid}, {x: i, y:3, grid}].sort(coordinateSort));
    }
})

test("knight initial state moves", () => {
    expect(getLegalMoves("wn1", start, grid).sort(coordinateSort)).toEqual([{x: 0, y:5, grid}, {x: 2, y:5, grid}]);
    expect(getLegalMoves("wn2", start, grid).sort(coordinateSort)).toEqual([{x: 5, y:5, grid}, {x: 7, y:5, grid}]);
    expect(getLegalMoves("bn1", start, grid).sort(coordinateSort)).toEqual([{x: 0, y:2, grid}, {x: 2, y:2, grid}]);
    expect(getLegalMoves("bn2", start, grid).sort(coordinateSort)).toEqual([{x: 5, y:2, grid}, {x: 7, y:2, grid}]);
})

test("other piece initial state moves are []", () => {
    const keys = Object.keys(start).filter(k => !(["pawn", "knight"].includes(start[k].pieceKey)));
    for (let key of keys) {
        expect(getLegalMoves(key, start, grid)).toEqual([]);
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

    expect(getLegalMoves("wp1", tokenMap, grid).sort(coordinateSort)).toEqual([{x: 0, y: 5, grid}, {x:2, y:5, grid }].sort(coordinateSort));
})

test("pawn movement: post move", () => {
    const movedPawn = new TokenData("pawn", 0, {x: 4, y: 5, grid});
    movedPawn.hasMoved = true;

    const tokenMap: TokenMap = {
        wp1: movedPawn
    }

    expect(getLegalMoves("wp1", tokenMap, grid).sort(coordinateSort)).toEqual([{x:4, y: 4, grid}].sort(coordinateSort));

});

test("pawn movement: blocked start", () => {
    const tokenMap: TokenMap = {
        wp1: new TokenData("pawn", 0,  {x:6, y:6, grid }),
        bp1: new TokenData("pawn", 1, {x:6, y:4, grid}),
    }
    expect(getLegalMoves("wp1", tokenMap, grid).sort(coordinateSort)).toEqual([{x:6, y: 5, grid}].sort(coordinateSort));
})


test("pawn movement: can't capture own pieces", () => {
    const tokenMap: TokenMap = {
        wp1: new TokenData("pawn", 0, {x:1, y:6, grid }),
        wp2: new TokenData("pawn", 0, {x:0, y:5, grid }),
    }
    expect(getLegalMoves("wp1", tokenMap, grid).sort(coordinateSort)).toEqual([{x:1, y: 4, grid}, {x:1, y: 5, grid}].sort(coordinateSort));
});


// BISHOP
// TODO

// KNIGHT
// TODO

// ROOK
// TODO

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