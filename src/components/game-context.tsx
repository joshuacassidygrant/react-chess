import React, { createContext, useReducer, useContext } from "react";
import { startState } from "../game/start";
import { CoordinateMove, GridData, TokenMap, User } from "../types";
import { GameState } from "../types/gameState";
import { applyHistory, checkGameState, doMove } from "../utils";

type Action = { type: "init", payload: State } |
{ type: "change-room", payload: { history: CoordinateMove[], users: User[], name: string } | null } |
{ type: "set-user", payload: {name: string, id: string} | null } |
{ type: "set-gamestate", payload: GameState } |
{ type: "set-tokenmap", payload: TokenMap } |
{ type: "start-game" } |
{ type: "set-users", payload: Map<string, User> } |
{ type: "move", payload: CoordinateMove } |
{ type: "consume-history", payload: CoordinateMove[] } |
{ type: "set-user-role", payload: { uid: string, role: number } }
type Dispatch = (action: Action) => void;
export type State = {
    socket: any | null,
    grid: GridData,
    user: User | null | undefined,
    room: string | null,
    turn: number,
    currentGameState: GameState,
    tokenMap: TokenMap,
    roomUsers: Map<string, User>,
    history: CoordinateMove[],
    currentUserRole: number,
}
type GameContextProviderProps = { children: React.ReactNode }

export const GameContext = createContext<{ state: State; dispatch: Dispatch } | undefined>(undefined);

export function gameReducer(state: State, action: Action) {
    switch (action.type) {
        case "init":
            return action.payload;
        case "change-room":
            // TODO: validate room
            const roomData = action.payload;

            if (roomData == null) {
                sessionStorage.removeItem("rc-room");
                return {
                    ...state,
                    room: null,
                    history: [],
                    tokenMap: {},
                    turn: -1,
                    roomUsers: new Map(),
                    currentUserRole: -1
                }
            }
            sessionStorage.setItem("rc-room", roomData.name);
            let history = roomData.history;
            let tokenMap = applyHistory(startState(state.grid), history, state.grid);
            let currentGameState = history.length === 0 ? GameState.NOT_STARTED : checkGameState(GameState.PLAYING, tokenMap, state.grid);
            let turn = history.length === 0 ? 0 : history[history.length - 1].turn + 1;
            let roomUsers = new Map<string, User>(Object.entries(roomData.users));
            let userId: string | undefined = state.user?.id;
            let user: User | undefined = userId ? roomUsers.get(userId) : undefined;
            let currentUserRole = user ? user.role : -1;


            let room = roomData.name;
            return {
                ...state,
                history,
                tokenMap,
                currentGameState,
                turn,
                roomUsers,
                room,
                currentUserRole
            }
        case "consume-history":
            history = action.payload;
            tokenMap = applyHistory(startState(state.grid), history, state.grid);
            currentGameState = history.length === 0 ? GameState.NOT_STARTED : checkGameState(GameState.PLAYING, tokenMap, state.grid);
            turn = history.length === 0 ? 0 : history[history.length - 1].turn + 1;
            return {
                ...state,
                history,
                tokenMap,
                currentGameState,
                turn
            }
        case "set-user":
            // TODO: validate user
            let setUser = action.payload ? action.payload : undefined;
            if (setUser) {
                sessionStorage.setItem("rc-user", JSON.stringify(setUser));
                let newUser = {id: setUser.id, data: setUser, role: -1}
                return {
                    ...state,
                    user: newUser
                }
            }
            return state;

        case "set-user-role":
            //TODO: validate
            let role = action.payload.role;
            let uid: string = action.payload.uid;
            let newUser = state.roomUsers.get(uid);
            let newRoomUsers = new Map(state.roomUsers);
            newUser ? newRoomUsers.set(uid, newUser) : console.log("No user");

            let currentUser = state.user;
            if (currentUser && uid === currentUser.id) {
                currentUser.role = role;
            }

            return {
                ...state,
                currentUserRole: role,
                roomUsers: newRoomUsers,
                user: currentUser
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
                history: [...state.history, action.payload]
            }
    }
}

export function GameContextProvider({ children }: GameContextProviderProps) {
    const [state, dispatch] = useReducer(gameReducer, {
        socket: null,
        grid: new GridData("init", 1, 1, 1, 1),
        user: null,
        room: null,
        turn: -1,
        currentGameState: GameState.NOT_STARTED,
        tokenMap: {},
        roomUsers: new Map<string, User>(),
        history: [],
        currentUserRole: -1
    });
    const value = { state, dispatch }
    return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGameContext() {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error("GameContext undefined. Please use within provider.")
    }
    return context;
}