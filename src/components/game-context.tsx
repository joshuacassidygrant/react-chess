import React, { createContext, useReducer, useContext} from "react";
import { startState } from "../game/start";
import { CoordinateMove, GridData, TokenMap, User } from "../types";
import { GameState } from "../types/gameState";
import { applyHistory, checkGameState, doMove } from "../utils";

type Action = {type: "init", payload: State} | 
            {type: "change-room", payload: string | null} |
            {type: "set-user", payload: User | null} |
            {type: "set-gamestate", payload: GameState} |
            {type: "set-tokenmap", payload: TokenMap} |
            {type: "start-game"} |
            {type: "set-users", payload: User[]} |
            {type: "move", payload: CoordinateMove} |
            {type: "consume-history", payload: CoordinateMove[]};
type Dispatch = (action: Action) => void;
export type State = {
    socket: any | null,
    grid: GridData,
    user: User | null,
    room: string | null,
    turn: number,
    currentGameState: GameState,
    tokenMap: TokenMap,
    roomUsers: User[],
    history: CoordinateMove[]
}
type GameContextProviderProps = {children: React.ReactNode}

export const GameContext = createContext<{state: State; dispatch: Dispatch} | undefined>(undefined);

export function gameReducer(state: State, action: Action) {
    switch (action.type) {
        case "init":
            return action.payload;
        case "change-room":
            // TODO: validate room
            const room = action.payload;
            room ? sessionStorage.setItem("rc-room", room) : sessionStorage.removeItem("rc-room");
            
            return {
                ...state,
                room
            }
        case "consume-history":
            const history = action.payload;
            const tokenMap = applyHistory(startState(state.grid), history, state.grid);
            const currentGameState = history.length === 0 ? GameState.NOT_STARTED : checkGameState(GameState.PLAYING, tokenMap, state.grid);
            const turn = history.length === 0 ? 0 : history[history.length - 1].turn + 1;
            return {
                ...state,
                history,
                tokenMap,
                currentGameState,
                turn
            }
        case "set-user":
            // TODO: validate user
            const user = action.payload;
            sessionStorage.setItem("rc-user", JSON.stringify(user));
            return {
                ...state,
                user
            }
        case "set-gamestate":
            // TODO: validate
            return {
                ...state,
                currentGameState: action.payload
            }
        case "set-tokenmap":
            //TODO: validate
            return {
                ...state,
                tokenMap: action.payload
            }
        case "set-users":
            //TODO: validate
            return {
                ...state,
                roomUsers: action.payload
            }
        case "start-game":
            return {
                ...state,
                turn: 0,
                currentGameState: GameState.NOT_STARTED,
                tokenMap: startState(state.grid),
            }
        case "move":
            //TODO: validate

            return {
                ...state,
                turn: action.payload.turn + 1,
                tokenMap: doMove(action.payload, state.grid, state.tokenMap),
                history:  [...state.history, action.payload]

            }
    }
}

export function GameContextProvider({children}: GameContextProviderProps) {
    const [state, dispatch] = useReducer(gameReducer, {
        socket: null,
        grid: new GridData("init", 1, 1, 1, 1),
        user: null,
        room: null,
        turn: -1,
        currentGameState: GameState.NOT_STARTED,
        tokenMap: {},
        roomUsers: [],
        history: [],
    });
    const value = {state, dispatch}
    return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGameContext() {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error("GameContext undefined. Please use within provider.")
    }
    return context;
}