import React, {FC, ReactElement, useState, useEffect} from "react";
import {Board} from "./board";
import {TokenMap, TokenData, Coordinate, GridData, CoordinateMove} from "../types/";
import {startState} from "../game/start";
import {updateTokenData, coordinateInList, doMove, toMove, emitMove} from "../utils/";
import {getOr} from "lodash/fp";
import {GameInfo} from "./game-info";
import { StartPanel } from "./start-panel";

const socketEndpoint = "http://localhost:3001";
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
    const [currentPlayer, setCurrentPlayer] = useState(-1);
    const [currentRoom, setCurrentRoom] = useState("");
    const [hoverCell, setHoverCell] = useState<Coordinate>({
        x:0, y:0, grid
    });

    const incrementTurn = (turn: number) => {
        setTurn(turn + 1);
    }

    useEffect(() => {
        socket.on("approved-move", function(move: CoordinateMove) {
            setTokenMap(tokenMap => doMove(move, grid, tokenMap, incrementTurn, (d) => {setTakenPieces(takenPieces => [...takenPieces, d])}));
        });
    }, []);


    return (
        <div>
            {currentRoom === ""  || currentPlayer === -1 ? (<StartPanel currentPlayer={currentPlayer} setCurrentPlayer={setCurrentPlayer} currentRoom={currentRoom} setCurrentRoom={setCurrentRoom} socket={socket} />) :
            <>
            <div>
                <GameInfo turn={turn} captured={takenPieces} currentPlayer={currentPlayer}/>
            </div>
            <div>
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
                            setTokenMap(doMove(move, grid, tokenMap, incrementTurn, (d) => {setTakenPieces([...takenPieces, d])}));
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
                        setLegalCells(token.piece.getLegalMoves(selectedToken, tokenMap, grid));
                    }
                } 
                tokenClick={
                    (e, id) =>{
                        if (turn % 2 === currentPlayer && tokenMap[id].player === turn % 2) {
                            setSelectedToken(id);
                            tokenMap[id].isSelected = true;
                        }
                    }
                }/>
            </div>
            </>
            }

        </div>
    )

}
