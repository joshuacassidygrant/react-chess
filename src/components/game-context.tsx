import React, { createContext, useReducer, useContext} from "react";
import { GridData, TokenMap, User } from "../types";
import { GameState } from "../types/gameState";

type Action = {type: "init", payload: State} | 
            {type: "change-room", payload: string | null} |
            {type: "set-user", payload: User | null} |
            {type: "move", payload: any};
type Dispatch = (action: Action) => void;
export type State = {
    socket: any | null,
    grid: GridData | null,
    user: User | null,
    room: string | null,
    turn: number,
    currentGameState: GameState | null,
    currentTokenMap: TokenMap | null,
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
        default:
            throw new Error(`Unlawful action: ${action.type}`)
    }
}

export function GameContextProvider({children}: GameContextProviderProps) {
    const [state, dispatch] = useReducer(gameReducer, {
        socket: null,
        grid: null,
        user: null,
        room: null,
        turn: -1,
        currentGameState: null,
        currentTokenMap: null,
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