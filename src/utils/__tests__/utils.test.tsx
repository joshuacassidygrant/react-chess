import { makeLine, toMove, doMove } from "..";
import { startState } from "../../game/start";
import { Coordinate, GridData, TokenData } from "../../types"
import { GameState } from "../../types/gameState";
import { checkGameState, filterIllegalMoves, getLegalMoves, inLegalCells, roleToName } from "../chessUtils";



const grid = new GridData("chessGrid", 600, 600, 8, 8);
function c(x: number, y: number): Coordinate {
    return {x, y, grid};
}


test("makeLine with no token coordinate returns empty", () => {
    const res = makeLine(1, 1, new TokenData("test", 0, undefined), {});
    expect(res).toEqual([]);
});


test("inLegalCells positive", () => {
    expect(inLegalCells([c(1,4), c(4,3)], 1, 4)).toBeTruthy();
});

test("inLegalCells negative", () => {
    expect(inLegalCells([c(1,4), c(4,3)], 4, 4)).toBeFalsy();
});


test("doMove with no token returns tokenMap", () => {
    const map = startState(grid);
    expect(doMove(toMove(0, c(4,4), c(4,5)), grid, map)).toBe(map);
});


test("roleToName role found", () => {
    expect(roleToName(1)).toEqual("Black");
});

test("roleToName role found", () => {
    expect(roleToName(55)).toEqual("None");
});


test("filterIllegalCoords removes anything off-board", () => {
    const map = startState(grid);
    expect(filterIllegalMoves(map, "wb1", map.wb1, [c(-1, 2), c(9, 4)], grid)).toEqual([]);
})


test("throws error when given asked for legal moves of piece with no id", () => {
    const map = startState(grid);
    expect(() => {getLegalMoves("tchotchke", map, grid)}).toThrow("No piece with id tchotchke");
});


test("check gameState returns Playing after called with not started", () => {
    const map = startState(grid);
    expect(checkGameState(GameState.NOT_STARTED, map, grid)).toEqual(GameState.PLAYING);
})

test("white checked", () => {
    const map = startState(grid);
    doMove(toMove(0, c(5,6), c(5, 5)), grid, map);
    doMove(toMove(1, c(3,0), c(5,6)), grid, map);
    expect(checkGameState(GameState.PLAYING, map,  grid)).toEqual(GameState.PLAYING);
})