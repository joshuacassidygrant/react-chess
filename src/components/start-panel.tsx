import React, {FC, ReactElement, useState} from "react";
import {Flex, Box} from "rebass";
import { User } from "../types";
import { chooseRole, joinRoom } from "../utils";

export type StartPanelProps = {
    socket: any,
    currentRoom: string,
    setCurrentRoom: (room: string) => void,
    currentPlayer: User | null,
    setCurrentPlayer: (player: User) => void,
    users: User[]
}

export const StartPanel: FC<StartPanelProps> = ({socket, currentRoom, setCurrentRoom, currentPlayer, setCurrentPlayer, users}): ReactElement => {

    const [currentRoomInput, setCurrentRoomInput] = useState(currentRoom);
    const [currentNameInput, setCurrentNameInput] = useState("");

    return (
        <Flex p={2} width={600} mx="auto" my={50} bg="#499">
            {
                currentRoom === "" ?
           (<Box width="100%">
               <h2>Join a Room</h2>
               <Flex justifyContent="space-between">
                   <Box>
                     <label>Room:</label>
                     <input  value={currentRoomInput} onChange={(e) => setCurrentRoomInput(e.target.value)}/>
                   </Box>
                   <Box>
                    <label>Nickname:</label>
                    <input  value={currentNameInput} onChange={(e) => setCurrentNameInput(e.target.value)}/>
                   </Box>
               </Flex>

               <button onClick={() => {
                    joinRoom(socket, {room: currentRoomInput, name: currentNameInput});
                    setCurrentRoom(currentRoomInput);
                    setCurrentPlayer({name: currentNameInput, socket: socket.id , role: -1});
                }}>Join Room</button> 
                <button onClick={() => {setCurrentRoomInput(btoa((Math.random()) + "").substr(5, 12))}}>Generate Room Code</button>
            </Box>
            ) : (
            <Box>
                <div>
                    <button disabled={users.filter(el => el.role === 0).length > 0} onClick={() => {
                        if (!currentPlayer) return;
                        chooseRole(socket, currentRoom, 0); 
                        setCurrentPlayer({...currentPlayer, role: 0});
                        }}>Join as White</button>
                    <button disabled={users.filter(el => el.role === 1).length > 0} onClick={() => {
                        if (!currentPlayer) return;
                        chooseRole(socket, currentRoom, 1); 
                        setCurrentPlayer({...currentPlayer, role: 1});
                    }}>Join as Black</button>
                    <button onClick={() => {
                        if (!currentPlayer) return;
                        chooseRole(socket, currentRoom, 2); 
                        setCurrentPlayer({...currentPlayer, role: 2});
                    }}>Join as Spectator</button>
                    <button onClick={() => {setCurrentRoomInput(""); setCurrentRoom("");}}>Leave Room</button>
                </div>
            </Box>)
            }
        </Flex>
    )

}