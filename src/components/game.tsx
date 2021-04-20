import React, {FC, ReactElement, useState} from "react";
import {Board} from "./board";
import {TokenMap, TokenData, Coordinate, GridData} from "../types/";
import {startState} from "../game/start";
import { white } from "../game/players";
import {maybeCaptureTokenOfColorAtCoordinate, updateTokenData, coordinateInList, getOpponent} from "../utils/";
import {getOr} from "lodash/fp";


// GAME CONSTANTS
const xWidthCells:number = 8;
const yHeightCells:number = 8;
const height:number = 600;
const width:number = 600;
const grid = new GridData("chessGrid", height, width, xWidthCells, yHeightCells);


export const Game: FC = (): ReactElement => {

    const [selectedToken, setSelectedToken] = useState<string>("");
    const [turn, setTurn] = useState<string>(white);
    const [legalCells, setLegalCells] = useState<Coordinate[]>([]);
    const [tokenMap, setTokenMap]= useState<TokenMap>(startState(grid));
    const [hoverCell, setHoverCell] = useState<Coordinate>({
        x:0, y:0, grid
    });

    return (
        <div>
            <div>
                {turn === white ? "White" : "Black"}'s turn.
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
                            setTokenMap(
                                updateTokenData(
                                    maybeCaptureTokenOfColorAtCoordinate(hoverCell, getOpponent(tokenData.color), tokenMap), 
                                    {[selectedToken]: tokenData.setCoordAndReturn(hoverCell)}
                                )
                            );
                            setTurn(getOpponent(turn));
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
                        if (tokenMap[id].color === turn) {
                            setSelectedToken(id);
                            tokenMap[id].isSelected = true;
                        }
                    }
                }/>
            </div>

        </div>
    )

}
