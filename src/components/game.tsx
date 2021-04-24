import React, {FC, ReactElement, useState, useEffect} from "react";
import {Board} from "./board";
import {TokenMap, TokenData, Coordinate, GridData, CoordinateMove} from "../types/";
import {startState} from "../game/start";
import {updateTokenData, coordinateInList, getOpponent, getTokenAtCoordinate, removeTokenData} from "../utils/";
import {getOr} from "lodash/fp";
import {GameInfo} from "./game-info";

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
    const [hoverCell, setHoverCell] = useState<Coordinate>({
        x:0, y:0, grid
    });

    useEffect(() => {
        socket.on("approved-move", function(move: CoordinateMove) {

            const token = getTokenAtCoordinate({x: move.from[0], y: move.from[1], grid}, tokenMap);
            if(!token) return;
            const tokenData = token[1];
            const captureToken = getTokenAtCoordinate({x: move.to[0], y: move.to[1], grid}, tokenMap);
            if (captureToken !== undefined && captureToken[1].player === getOpponent(tokenData.player)) {
                setTokenMap(removeTokenData(tokenMap, captureToken[0]));
                setTakenPieces([...takenPieces, captureToken[1]]);
            }
            setTokenMap(updateTokenData(tokenMap, {[selectedToken]: tokenData.setCoordAndReturn({x: move.to[0], y: move.to[1], grid})}));
            setTurn(turn + 1);
        });
    }, []);

    return (
        <div>
            <div>
                <GameInfo turn={turn} captured={takenPieces}/>
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

                            const captureToken = getTokenAtCoordinate(hoverCell, tokenMap);
                            if (captureToken !== undefined && captureToken[1].player === getOpponent(tokenData.player)) {
                                setTokenMap(removeTokenData(tokenMap, captureToken[0]));
                                setTakenPieces([...takenPieces, captureToken[1]]);
                            }
                            setTokenMap(updateTokenData(tokenMap, {[selectedToken]: tokenData.setCoordAndReturn(hoverCell)}));
                            setTurn(turn + 1);
                            
                            emitMove(socket, originalCoord, hoverCell);
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
                        if (tokenMap[id].player === turn % 2) {
                            setSelectedToken(id);
                            tokenMap[id].isSelected = true;
                        }
                    }
                }/>
            </div>

        </div>
    )

}

function emitMove(socket: any, from: Coordinate, to: Coordinate): void {
    socket.emit("request-move", {from: [from.x, from.y], to: [to.x, to.y]});
}