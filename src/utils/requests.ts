import { applyHistory, checkGameState } from ".";
import { State } from "../components/game-context";
import { startState } from "../game/start";
import { CoordinateMove, GridData, User } from "../types";
import { GameState } from "../types/gameState";

export const bePath = process.env.BE_PATH || "http://localhost:3001";
export const socketEndpoint = bePath;

export function emitMove(socket: any, room: string, move: CoordinateMove): void {
    socket.emit("request-move", {move, room});
}

export function joinRoom(socket: any, room: string, uid: string): void {
    socket.emit("request-join-room", {room, uid});
}

export function chooseRole(socket: any, uid: string, room:string, role:number): void {
    socket.emit("request-role", {role, uid, room});
}

export function sendChat(socket: any, room: string, username: string, message: string): void {
    socket.emit("request-chat", {room, username, message});
}

export function changeName(socket: any, room: string, user: User, name: string): void {
    socket.emit("request-namechange", {socket: socket.id, uid: user.id, room, name});
}

export function requestRandomString(words: number, callback: (str: string) => void): void {
    fetch(`${bePath}/random?n=${words}`)
    .then(res => res.text())
    .then(res => callback(res));
}

export function requestRoomHistory(room: string, callback: (moves: CoordinateMove[]) => void) : void {
    fetch(`${bePath}/history?room=${room}`)
    .then(res => res.json())
    .then(res => callback(res));
}

export function requestUserReconnect(uid: string, room: string) : Promise<any>  {
    return fetch(`${bePath}/user?uid=${uid}&&room=${room}`);
}

export function requestNewUser(name: string) : Promise<any> {
    return fetch(`${bePath}/user?name=${name}`);
}

export function requestRoomData(room: string) : Promise<any> {
    return fetch(`${bePath}/room?room=${room}`)
}

export function getInitData(socket: any, grid: GridData, ctx: any ) : Promise<State> {
    const state: State = {
        socket,
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

    const uString = sessionStorage.getItem("rc-user");
    const storedUser: {name: string, id: string} | null = uString ?  JSON.parse(uString) : null;
    const roomName = sessionStorage.getItem("rc-room");

    if (storedUser && roomName) {
        return requestUserReconnect(storedUser.id, roomName).then(res => {
            return res.json();
        }).then( res => {
            const user = res.user;
            if (!user) return null;
            const uid = res.user.id;
            if (uid) {
                state.user = {id: uid, data: res.user, role: -1};
            }
            return requestRoomData(roomName);
        }).then(res => {
            if (res === null) return null;
            return res.json();
        }).then(roomData => {
            if (roomData === null) return(state);
            state.room = roomData.name;
            state.roomUsers = new Map<string, User>(Object.entries(roomData.users));
            state.history = roomData.history;
            state.tokenMap = applyHistory(startState(state.grid), roomData.history, state.grid);
            state.currentGameState = roomData.history.length === 0 ? GameState.NOT_STARTED : checkGameState(GameState.PLAYING, state.tokenMap, state.grid);
            state.turn = roomData.history.length === 0 ? 0 :roomData.history[roomData.history.length - 1].turn + 1;
            if (storedUser.id in roomData.users) {
                const roomUser = roomData.users[storedUser.id];
                state.currentUserRole = roomUser.role;
                if (state.user) state.user.role = roomUser.role;   
            }
            socket.emit("request-join-room", {room: roomData.name, uid: storedUser.id, role: state.currentUserRole});
            return(state);
        })  
    }
    return new Promise<State>((resolve, reject) => {
        resolve(state);
    })
}