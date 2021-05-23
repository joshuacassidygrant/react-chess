import {FC, ReactElement, useState, useEffect} from "react";
import {io} from "socket.io-client";

import {Board} from "./board";
import {TokenData, Coordinate, GridData, CoordinateMove} from "../types/";
import {startState} from "../game/start";
import {coordinateInList, toMove, emitMove, socketEndpoint, getLegalMoves, checkGameState, coordinatesEqual, requestUserReconnect, requestRoomData, getInitData} from "../utils/";
import {GameInfo} from "./game-info";
import { StartPanel } from "./start-panel";
import { UserList } from "./user-list";
import { ChatBox } from "./chat-box";
import { Box, Flex } from "rebass";
import { GameState } from "../types/gameState";
import { useGameContext} from "./game-context";
import { resourceLimits } from "node:worker_threads";


// GAME CONSTANTS
const xWidthCells:number = 8;
const yHeightCells:number = 8;
const height:number = 600;
const width:number = 600;

export const Game: FC = (): ReactElement => {
    const ctx = useGameContext();
    const {room, user, grid, socket, currentGameState, tokenMap, turn, history, currentUserRole} = ctx.state;

    const [selectedToken, setSelectedToken] = useState<string>("");
    const [legalCells, setLegalCells] = useState<Coordinate[]>([]);
    const [hoverCell, setHoverCell] = useState<Coordinate>({
        x:0, y:0, grid
    });

    useEffect(() => {
        // First load initialization
        const socket = io(socketEndpoint);
        const grid = new GridData("chessGrid", height, width, xWidthCells, yHeightCells);

        getInitData(socket, grid, ctx).then(res => {
            ctx.dispatch({type: "init", payload: res});
        });


        ctx.dispatch({type: "start-game"});



        socket.on("approved-move", function(move: CoordinateMove) {
            ctx.dispatch({type: "move", payload: move})
        });
        
        socket.on("users-changed", function(users: any) {
            ctx.dispatch({type: "set-users", payload: new Map(Object.entries(users))});
        });

        socket.on("restart-game", function() {
            ctx.dispatch({type: "start-game"});
        });

        socket.on("room-joined", function(res: any) {
            const uid: string = res.uid;
            const room = res.room;

            //if (uid === user?.id) {
                //ctx.dispatch({type: "change-room", payload: room})
            //}
            requestRoomData(room).then(res => {
                return res.json();
            }).then(res => {
                if (res === null) return null;
                console.log(res);
                ctx.dispatch({type: "change-room", payload: res})
            });
        })

       

        return () => {
            // clean up goes here
            //socket.emit("leave-room", {uid: user?.id, room});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        ctx.dispatch({type: "set-gamestate", payload: checkGameState(currentGameState, tokenMap, grid)});
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tokenMap])

    return (
        <div>
            {!room || !user || currentUserRole === -1 ? (<StartPanel />) :
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
                                    const specialMove =  tokenData.getPiece().getSpecialMoves(selectedToken, tokenMap, history).find(entry => coordinatesEqual(entry[0], hoverCell));
                                    if (specialMove) {
                                        specialMove[1].map(mv => emitMove(socket, room, toMove(turn, mv[0], mv[1])));
                                    } else {
                                        emitMove(socket, room, toMove(turn, originalCoord, hoverCell));
                                    }
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
                                if (turn % 2 === currentUserRole && tokenMap[id].player === turn % 2) {
                                    setSelectedToken(id);
                                    const token = tokenMap[id];
                                    token.isSelected = true;
                                    setLegalCells(getLegalMoves(id, tokenMap, grid, history));
                                }
                            }
                        }/>
                    </Box>
                    <Box width={300}>
                        <h3>Room: {room}</h3>
                        <ChatBox />
                        <UserList />
                        <button onClick={() => {
                            socket.emit("leave-room", {uid: user.id, room});
                            ctx.dispatch({type: "change-room", payload: null});
                        }}>Leave Room</button>
                    </Box>
                </Flex>

            </Box>
            }
        </div>
    )

}
