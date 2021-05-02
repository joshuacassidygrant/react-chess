import {FC, ReactElement, useState, useEffect} from "react";
import {io} from "socket.io-client";

import {Board} from "./board";
import {TokenData, Coordinate, GridData, CoordinateMove} from "../types/";
import {startState} from "../game/start";
import {coordinateInList, toMove, emitMove, socketEndpoint, filterIllegalMoves, checkGameState} from "../utils/";
import {GameInfo} from "./game-info";
import { StartPanel } from "./start-panel";
import { UserList } from "./user-list";
import { ChatBox } from "./chat-box";
import { Box, Flex } from "rebass";
import { GameState } from "../types/gameState";
import { useGameContext} from "./game-context";


// GAME CONSTANTS
const xWidthCells:number = 8;
const yHeightCells:number = 8;
const height:number = 600;
const width:number = 600;

export const Game: FC = (): ReactElement => {
    const ctx = useGameContext();
    const {room, user, grid, socket, currentGameState, tokenMap, turn} = ctx.state;

    const [selectedToken, setSelectedToken] = useState<string>("");
    const [legalCells, setLegalCells] = useState<Coordinate[]>([]);
    const [hoverCell, setHoverCell] = useState<Coordinate>({
        x:0, y:0, grid
    });


    useEffect(() => {
        // First load initialization
        const socket = io(socketEndpoint);
        const grid = new GridData("chessGrid", height, width, xWidthCells, yHeightCells);

        ctx.dispatch({type: "init", payload: {
            socket,
            grid,
            turn: 0,
            user: null,
            room: null,
            currentGameState: GameState.NOT_STARTED,
            tokenMap: startState(grid),
            roomUsers: []
        }});

        ctx.dispatch({type: "start-game"});
        
        socket.on("approved-move", function(move: CoordinateMove) {
            ctx.dispatch({type: "move", payload: move})
        });
        
        socket.on("users-changed", function(users: any) {
            ctx.dispatch({type: "set-users", payload: Object.values(users)});
        });

        socket.on("restart-game", function() {
            ctx.dispatch({type: "start-game"});
        });

        return () => {
            // clean up goes here
            socket.emit("leave-room", room);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        ctx.dispatch({type: "set-gamestate", payload: checkGameState(currentGameState, tokenMap)});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tokenMap])

    return (
        <div>
            {!room || !user || user.role === -1 ? (<StartPanel />) :
            <Box width={1100} mx="auto">
                <GameInfo/>
                <Flex width={1100} mx="auto">
                    <Box width={800} >
                        <Board 
                        highlightCells={legalCells}
                        mouseUp={
                            (e) => {
                                if(!selectedToken || !room) return;
                                const tokenData: TokenData = tokenMap[selectedToken];
                
                                if(!grid.coordinateInGridBounds(hoverCell)) {
                                    // Currently  not allowing offgrid movement
                                    return;
                                } else if (hoverCell != null && coordinateInList(hoverCell, legalCells)) {
                                    const originalCoord = tokenData.coord;
                                    if (!originalCoord) return;
                                    const move = toMove(turn, originalCoord, hoverCell);
                                    ctx.dispatch({type: "move", payload: move})
                                    emitMove(socket, room, move);

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
                                const token = tokenMap[selectedToken];
                                if (!token) return;
                                token.pos = pos;
                            }
                        } 
                        tokenClick={
                            (e, id) =>{
                                if (turn % 2 === user.role && tokenMap[id].player === turn % 2) {
                                    setSelectedToken(id);
                                    const token = tokenMap[id];
                                    token.isSelected = true;
                                    setLegalCells(filterIllegalMoves(tokenMap, id, token, token.piece.getLegalMoves(id, tokenMap, grid)));
                                }
                            }
                        }/>
                    </Box>
                    <Box width={300}>
                        <h3>Room: {room}</h3>
                        <ChatBox />
                        <UserList />
                        <button onClick={() => {
                            socket.emit("leave-room", room);
                            ctx.dispatch({type: "change-room", payload: null});
                        }}>Leave Room</button>
                    </Box>
                </Flex>

            </Box>
            }
        </div>
    )

}
