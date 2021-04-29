import React, {FC, ReactElement, useEffect, useState} from "react";
import {Flex, Box} from "rebass";
import { User } from "../types";
import { chooseRole, joinRoom, requestRandomString } from "../utils";
import { RandomButton } from "./random-button";
import { TextInput } from "./text-input";

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

    useEffect(() => {
        if (currentRoomInput === "") {
            requestRandomString(3, (txt)=>{setCurrentRoomInput(txt)});
        }

        if (currentNameInput === "") {
            requestRandomString(2, (txt)=>{setCurrentNameInput(txt)});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Flex p={2} width={600} mx="auto" my={50} bg="#499">
            {
                currentRoom === "" ?
           (<Box width="100%">
               <h2>Join a Room</h2>
               <Flex justifyContent="space-between" mb={10}>
                   <Box width="45%">
                     <Box textAlign="left"><label>Room:</label></Box>
                     <Flex alignItems="center">
                        <TextInput style={{width: "100%"}} value={currentRoomInput} onChange={(e) => setCurrentRoomInput(e.target.value)}/>
                        <RandomButton click={() => {requestRandomString(3, (txt)=>{setCurrentRoomInput(txt)})}}/>
                     </Flex>
                   </Box>
                   <Box width="45%">
                    <Box textAlign="left"><label>Nickname:</label></Box>
                    <Flex alignItems="center">
                        <TextInput style={{width: "100%"}} value={currentNameInput} onChange={(e) => setCurrentNameInput(e.target.value)}/>
                        <RandomButton click={() => {requestRandomString(2, (txt)=>{setCurrentNameInput(txt)})}}/>
                    </Flex>
                   </Box>
               </Flex>

               <button onClick={() => {
                    joinRoom(socket, {room: currentRoomInput, name: currentNameInput});
                    setCurrentRoom(currentRoomInput);
                    setCurrentPlayer({name: currentNameInput, socket: socket.id , role: -1});
                }}>Join Room</button> 
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