import React, {FC, ReactElement, useState} from "react";
import {Flex, Box} from "rebass";
import { joinRoom } from "../utils";

export type StartPanelProps = {
    socket: any,
    currentRoom: string,
    setCurrentRoom: (room: string) => void,
    currentPlayer: number,
    setCurrentPlayer: (player: number) => void
}

export const StartPanel: FC<StartPanelProps> = ({socket, currentRoom, setCurrentRoom, currentPlayer, setCurrentPlayer}): ReactElement => {

    const [currentRoomInput, setCurrentRoomInput] = useState(currentRoom);


    return (
        <Flex p={2} width={600} mx="auto" my={50} bg="#499">
            {
                currentRoom === "" ?
           (<Box>
                <input  value={currentRoomInput} onChange={(e) => setCurrentRoomInput(e.target.value)}/><button onClick={() => {
                    joinRoom(socket, currentRoomInput);
                    setCurrentRoom(currentRoomInput);
                    setCurrentPlayer(-1);
                }}>Join Room</button> 
                <button onClick={() => {setCurrentRoomInput(btoa((Math.random()) + "").substr(5, 12))}}>Generate Room Code</button>
            </Box>
            ) : (
            <Box>
                <div>
                    <button onClick={() => {setCurrentPlayer(0)}}>Join as White</button>
                    <button onClick={() => {setCurrentPlayer(1)}}>Join as Black</button>
                    <button onClick={() => {setCurrentPlayer(2)}}>Join as Spectator</button>
                    <button onClick={() => {setCurrentRoomInput(""); setCurrentRoom("");}}>Leave Room</button>
                </div>
            </Box>)
            }
        </Flex>
    )

}