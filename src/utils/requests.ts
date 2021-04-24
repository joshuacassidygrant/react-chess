import { CoordinateMove } from "../types";

export function emitMove(socket: any, room: string, move: CoordinateMove): void {
    socket.emit("request-move", {move, room});
}

export function joinRoom(socket: any, room: string): void {
    socket.emit("request-join-room", room);
}