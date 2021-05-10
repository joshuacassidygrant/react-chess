import { CoordinateMove, User } from "../types";

export const socketEndpoint = "http://localhost:3001";

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

export function changeName(socket: any, room: string, name: string): void {
    socket.emit("request-namechange", {socket: socket.id, room, name});
}

export function requestRandomString(words: number, callback: (str: string) => void): void {
    fetch(`http://localhost:3001/random?n=${words}`)
    .then(res => res.text())
    .then(res => callback(res));
}

export function requestRoomHistory(room: string, callback: (moves: CoordinateMove[]) => void) : void {
    fetch(`http://localhost:3001/history?room=${room}`)
    .then(res => res.json())
    .then(res => callback(res));
}

export function requestUserReconnect(uid: string) : Promise<any>  {
    return fetch(`http://localhost:3001/user?uid=${uid}`);
}

export function requestNewUser(name: string) : Promise<any> {
    return fetch(`http://localhost:3001/user?name=${name}`);
}

export function requestRoomData(room: string) : Promise<any> {
    return fetch(`http://localhost:3001/room?room=${room}`)
}