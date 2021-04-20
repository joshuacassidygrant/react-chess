import React, {FC, ReactElement, useState, useEffect} from "react";
import {Board} from "./board";
import {TokenMap, TokenData, Coordinate, Position, GridData} from "../types/";
import {startState} from "../game/start";
import {GridProps} from "./grid";
import { white } from "../game/players";
import {maybeCaptureTokenOfColorAtCoordinate, updateTokenData, coordinateInList, getOpponent,  getGridCoordinates, coordinateInGridBounds} from "../utils/";
import {getOr} from "lodash/fp";

type GameProps = {
    height: number,
    width: number
}

const xWidthCells:number = 8;
const yHeightCells:number = 8;

export const Game: FC<GameProps> = ({height, width}): ReactElement => {
    const grid = new GridData("chessGrid", height, width, xWidthCells, yHeightCells);

    const [selectedToken, setSelectedToken] = useState<string>("");
    const [turn, setTurn] = useState<string>(white);
    const [legalCells, setLegalCells] = useState<Coordinate[]>([]);

    const [tokenMap, setTokenMap]= useState<TokenMap>(startState(grid));
    const [mousePos, setMousePos] = useState<Position>({
        x:0, y:0
    });

    const [hoverCell, setHoverCell] = useState<Coordinate>({
        x:0, y:0, grid
    });

    return (
        <div>
            {turn === white ? "White" : "Black"}'s turn.
            <Board 
                tokenMap={tokenMap} gridData={grid} mousePos={mousePos} selectedToken={selectedToken} legalCells={legalCells}
                mouseUp={
                    (e) => {
                        if(!selectedToken) return;
                        const tokenData: TokenData = tokenMap[selectedToken];
        
                        if(!coordinateInGridBounds(hoverCell)) {
                            const pos = {x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY};
                            setTokenMap(updateTokenData(tokenMap, {[selectedToken]: tokenData.setPosAndReturn(pos)}));
                        } else if (hoverCell != null && coordinateInList(hoverCell, legalCells)) {
                            setTokenMap(
                                updateTokenData(
                                    maybeCaptureTokenOfColorAtCoordinate(hoverCell, getOpponent(tokenData.color), tokenMap), 
                                    {[selectedToken]: tokenData.setCoordAndReturn(hoverCell)}
                                )
                            );
                            setTurn(getOpponent(turn));
                        }
        
                        setSelectedToken("");
                        setLegalCells([]);
                    }
                } 
                mouseMove={
                    (e) => {
                        if (!selectedToken) return;
                        const pos = {x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY};
                        setMousePos(pos);
                        setHoverCell(getGridCoordinates(pos, grid));
                        const token = getOr(null, selectedToken, tokenMap);
                        if (!token) return;
                        setLegalCells(token.piece.getLegalMoves(selectedToken, tokenMap, grid));
                    }
                } 
                tokenClick={
                    (e, id) =>{
                        setMousePos({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY});
                        if (tokenMap[id].color === turn) {
                            setSelectedToken(id);
                        }
                    }
                }/>
        </div>
    )

}
