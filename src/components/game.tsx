import React, {FC, ReactElement, useState, useEffect} from "react";
import {Board} from "./board";
import {TokenMap, TokenData, Coordinate, GridData, CoordinateMove, User} from "../types/";
import {startState} from "../game/start";
import {updateTokenData, coordinateInList, doMove, toMove, emitMove, socketEndpoint, filterIllegalMoves, checkGameState} from "../utils/";
import {getOr} from "lodash/fp";
import {GameInfo} from "./game-info";
import { StartPanel } from "./start-panel";
import { UserList } from "./user-list";
import { ChatBox } from "./chat-box";
import { Box, Flex } from "rebass";
import { GameState } from "../types/gameState";

const io = require("socket.io-client");

// GAME CONSTANTS
const xWidthCells:number = 8;
const yHeightCells:number = 8;
const height:number = 600;
const width:number = 600;
const grid = new GridData("chessGrid", height, width, xWidthCells, yHeightCells);

const socket = io(socketEndpoint, { 
    transport : ['websocket'],  
    withCredentials: true
});


export const Game: FC = (): ReactElement => {
    const [selectedToken, setSelectedToken] = useState<string>("");
    const [turn, setTurn] = useState<number>(0);
    const [legalCells, setLegalCells] = useState<Coordinate[]>([]);
    const [tokenMap, setTokenMap]= useState<TokenMap>(startState(grid));
    const [takenPieces, setTakenPieces] = useState<TokenData[]>([]);
    const [currentPlayer, setCurrentPlayer] = useState<User | null>(null);
    const [currentRoom, setCurrentRoom] = useState("");
    const [currentGameState, setCurrentGameState] = useState<GameState>(GameState.NOT_STARTED);
    const [hoverCell, setHoverCell] = useState<Coordinate>({
        x:0, y:0, grid
    });
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        socket.on("approved-move", function(move: CoordinateMove) {
            setTokenMap(tokenMap => doMove(move, grid, tokenMap, (d) => {setTakenPieces(takenPieces => [...takenPieces, d])}));
            setTurn(turn => move.turn + 1)
        });
        socket.on("users-changed", function(users: any[]) {
            setUsers(Object.values(users));
        });

        return () => {
            // clean up goes here
            socket.emit("leave-room", currentRoom);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setCurrentGameState(checkGameState(currentGameState, tokenMap));
    }, [tokenMap])

    useEffect(() => {
        console.log(currentGameState);
    }, [currentGameState])

    return (
        <div>
            {currentRoom === ""  || currentPlayer === null || currentPlayer.role === -1 ? (<StartPanel users={users} currentPlayer={currentPlayer} setCurrentPlayer={setCurrentPlayer} currentRoom={currentRoom} setCurrentRoom={setCurrentRoom} socket={socket} />) :
            <Box width={1100} mx="auto">
                <GameInfo room={currentRoom} turn={turn} captured={takenPieces} currentPlayer={currentPlayer}/>
                <Flex width={1100} mx="auto">
                    <Box width={800} >
                        <Board 
                        tokenMap={tokenMap} gridData={grid} legalCells={legalCells}
                        mouseUp={
                            (e) => {
                                if(!selectedToken) return;
                                const tokenData: TokenData = tokenMap[selectedToken];
                
                                if(!grid.coordinateInGridBounds(hoverCell)) {
                                    const pos = {x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY};
                                    setTokenMap(updateTokenData(tokenMap, {[selectedToken]: tokenData.setPosAndReturn(pos)}));
                                    // TODO: this lets us leave tokens randomly off the board...
                                } else if (hoverCell != null && coordinateInList(hoverCell, legalCells)) {
                                    const originalCoord = tokenData.coord;
                                    if (!originalCoord) return;
                                    const move = toMove(turn, originalCoord, hoverCell);
                                    const newMap = doMove(move, grid, tokenMap, (d) => {setTakenPieces([...takenPieces, d])});
                                    setTokenMap(newMap);
                                    setTurn(turn => move.turn + 1)
                                    emitMove(socket, currentRoom, move);

                                }
                                tokenMap[selectedToken].isSelected = false;
                                setSelectedToken("");
                                setLegalCells([]);


                            }
                        } 
                        mouseMove={
                            (e) => {
                                if (!selectedToken) return;
                                const pos = {x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY};
                                setHoverCell(grid.getGridCoordinates(pos));
                                const token = getOr(null, selectedToken, tokenMap);
                                if (!token) return;
                                token.pos = pos;
                            }
                        } 
                        tokenClick={
                            (e, id) =>{
                                if (turn % 2 === currentPlayer.role && tokenMap[id].player === turn % 2) {
                                    setSelectedToken(id);
                                    const token = tokenMap[id];
                                    token.isSelected = true;
                                    setLegalCells(filterIllegalMoves(tokenMap, id, token, token.piece.getLegalMoves(id, tokenMap, grid)));
                                }
                            }
                        }/>
                    </Box>
                    <Box width={300}>
                        <ChatBox socket={socket} room={currentRoom} username={currentPlayer.name}  />
                        <UserList users={users} />
                        <button onClick={() => {
                            socket.emit("leave-room", currentRoom);
                            setCurrentRoom("");
                        }}>Leave Room</button>
                    </Box>
                </Flex>

            </Box>
            }

        </div>
    )

}
