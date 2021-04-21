import React, {FC, ReactElement, useState} from "react";
import {Board} from "./board";
import {TokenMap, TokenData, Coordinate, GridData} from "../types/";
import {startState} from "../game/start";
import {updateTokenData, coordinateInList, getOpponent, getTokenAtCoordinate, removeTokenData} from "../utils/";
import {getOr} from "lodash/fp";
import {GameInfo} from "./game-info";
// GAME CONSTANTS
const xWidthCells:number = 8;
const yHeightCells:number = 8;
const height:number = 600;
const width:number = 600;
const grid = new GridData("chessGrid", height, width, xWidthCells, yHeightCells);


export const Game: FC = (): ReactElement => {

    const [selectedToken, setSelectedToken] = useState<string>("");
    const [turn, setTurn] = useState<number>(0);
    const [legalCells, setLegalCells] = useState<Coordinate[]>([]);
    const [tokenMap, setTokenMap]= useState<TokenMap>(startState(grid));
    const [takenPieces, setTakenPieces] = useState<TokenData[]>([]);
    const [hoverCell, setHoverCell] = useState<Coordinate>({
        x:0, y:0, grid
    });

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
                            const captureToken = getTokenAtCoordinate(hoverCell, tokenMap);
                            if (captureToken !== undefined && captureToken[1].player === getOpponent(tokenData.player)) {
                                setTokenMap(removeTokenData(tokenMap, captureToken[0]));
                                setTakenPieces([...takenPieces, captureToken[1]]);
                            }
                            setTokenMap(updateTokenData(tokenMap, {[selectedToken]: tokenData.setCoordAndReturn(hoverCell)}));
                            setTurn(turn + 1);
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
