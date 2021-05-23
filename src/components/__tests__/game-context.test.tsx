import { startState } from "../../game/start";
import { GridData, User } from "../../types";
import { GameState } from "../../types/gameState";
import {gameReducer} from "../game-context";

const preinitialState = {
    socket: null,
    grid: new GridData("initial", 1, 1, 1, 1),
    user: null,
    room: null,
    turn: -1,
    currentGameState: GameState.NOT_STARTED,
    tokenMap: {},
    roomUsers: new Map<string, User>(),
    history: [],
    currentUserRole: -1

};
const grid = new GridData("testGrid", 2, 2, 2, 2);

const initializedState ={
    socket: "socket",
    grid,
    turn: 0,
    user: null,
    room: null,
    currentGameState: GameState.NOT_STARTED,
    tokenMap: startState(grid),
    roomUsers: new Map<string, User>(),
    history: [],
    currentUserRole: -1
}

const user = {id: "test", name: "Felipe Testorossa"}
const user2 = {id: "test", name: "Ms. Testorini"}

test("init reducer should return the context passed in", () => {
    expect(gameReducer(preinitialState, {type: "init", payload: initializedState})).toEqual(initializedState);
});

test("change-room with unstarted game", () => {
    expect(gameReducer(initializedState, {type: "change-room", payload: {history: [], users: [], name: "Room3"}})).toEqual({...initializedState, room: "Room3"});
});

test("set-user reducer should set user only", () => {
    expect(gameReducer(initializedState, {type: "set-user", payload: user})).toEqual({...initializedState, user: {id: user.id, data: user, role: -1}});
});

test("set-gamestate should set gamestate only", () => {
    expect(gameReducer(initializedState, {type: "set-gamestate", payload: GameState.BLACK_WINS})).toEqual({...initializedState, currentGameState: GameState.BLACK_WINS});
})

test("set-tokenmap should set tokenmap only", () => {
    expect(gameReducer(initializedState, {type: "set-tokenmap", payload: {}})).toEqual({...initializedState, tokenMap: {}});
})

test("set-users sets room users only", () => {
    expect(gameReducer(initializedState, {type: "set-users", payload: [user, user2]})).toEqual({...initializedState, roomUsers: [user, user2]});
});

test("start-game sets turn, state and tokenmap correctly", () => {
    expect(gameReducer(initializedState, {type: "start-game"})).toEqual({...initializedState, turn: 0, currentGameState: GameState.NOT_STARTED, tokenMap: startState(grid)});
})

test("move moves one piece on tokenmap and increments turn", () => {
    gameReducer(initializedState, {type: "start-game"});
    const move = {turn: 0, from:[4, 6], to:[4,4]};
    const history = [move]
    expect(gameReducer(initializedState, {type: "move", payload:move})).toEqual({...initializedState, turn: 1, history, tokenMap: {...startState(grid), wp4: {...startState(grid).wp4, hasMoved: true, coord: {x: 4, y:4, grid}}}});
}) 