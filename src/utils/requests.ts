import { CoordinateMove } from "../types";

export const socketEndpoint = "http://localhost:3001";

export function emitMove(socket: any, room: string, move: CoordinateMove): void {
    socket.emit("request-move", {move, room});
}

export function joinRoom(socket: any, req: any): void {
    socket.emit("request-join-room", req);
}

export function chooseRole(socket: any, room:string, role:number): void {
    socket.emit("request-role", {role, room});
}

export function sendChat(socket: any, room: string, username: string, message: string): void {
    socket.emit("request-chat", {room, username, message});
}

export function requestRandomString(words: number, callback: (str: string) => void): void {
    fetch(`http://localhost:3001/random?n=${words}`)
    .then(res => res.text())
    .then(res => callback(res));
}