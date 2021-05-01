import React, { createContext, useReducer, useContext} from "react";
import { startState } from "../game/start";
import { CoordinateMove, GridData, TokenMap, User } from "../types";
import { GameState } from "../types/gameState";
import { doMove } from "../utils";

type Action = {type: "init", payload: State} | 
            {type: "change-room", payload: string | null} |
            {type: "set-user", payload: User | null} |
            {type: "set-gamestate", payload: GameState} |
            {type: "set-tokenmap", payload: TokenMap} |
            {type: "start-game"} |
            {type: "move", payload: CoordinateMove};
type Dispatch = (action: Action) => void;
export type State = {
    socket: any | null,
    grid: GridData | null,
    user: User | null,
    room: string | null,
    turn: number,
    currentGameState: GameState,
    tokenMap: TokenMap,
    roomUsers: User[]
}
type GameContextProviderProps = {children: React.ReactNode}

export const GameContext = createContext<{state: State; dispatch: Dispatch} | undefined>(undefined);

function gameReducer(state: State, action: Action) {
    switch (action.type) {
        case "init":
            return action.payload;
        case "change-room":
            // TODO: validate room
            return {
                ...state,
                room: action.payload
            }
        case "set-user":
            // TODO: validate user
            return {
                ...state,
                user: action.payload
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
                currentTokenMap: action.payload
            }
        case "start-game":
            if (!state.grid) {
                throw new Error("No grid defined!");
            }
            return {
                ...state,
                turn: 0,
                currentGameState: GameState.NOT_STARTED,
                currentTokenMap: startState(state.grid),
            }
        case "move":
            //TODO: validate
            if (!state.grid) {
                throw new Error("No grid defined!");
            }
            return {
                ...state,
                turn: action.payload.turn + 1,
                tokenMap: doMove(action.payload, state.grid, state.tokenMap)
            }
            // TODO alter state
            return state;
    }
}

export function GameContextProvider({children}: GameContextProviderProps) {
    const [state, dispatch] = useReducer(gameReducer, {
        socket: null,
        grid: null,
        user: null,
        room: null,
        turn: -1,
        currentGameState: GameState.NOT_STARTED,
        tokenMap: {},
        roomUsers: []
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