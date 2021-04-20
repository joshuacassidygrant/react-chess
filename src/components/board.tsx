import React, {FC, ReactElement} from "react";
import {Grid} from "./grid";
import {Token} from "./token";
import {Position, GridData, TokenMap, Coordinate} from "../types";

type BoardProps = {
    tokenMap: TokenMap,
    gridData: GridData,
    mouseMove: (e: React.MouseEvent) => void,
    mouseUp: (e: React.MouseEvent) => void,
    tokenClick: (e: React.MouseEvent, id: string) => void,
    mousePos: Position,
    selectedToken: string,
    legalCells: Coordinate[]
}

export const Board: FC<BoardProps> = ({tokenMap, gridData, mouseMove, mouseUp, tokenClick, mousePos, selectedToken, legalCells}): ReactElement => 
        (
        <svg style={{width: gridData.width + 2 * gridData.xCellWidth, height: gridData.height + 2 * gridData.yCellHeight, margin: `${gridData.yCellHeight / 2} auto`, backgroundColor:"#26312a"}} 
            onMouseUp={mouseUp}
            onMouseMove={mouseMove} 
        >
            <Grid gridData={gridData} legalCells={legalCells}/>
            {
                Object.entries(tokenMap).map(([id, token]) => (
                    <Token 
                        key={id} id={id} 
                        x={selectedToken === id ? mousePos.x : token.getPosition().x} y={selectedToken === id ? mousePos.y : token.getPosition().y} 
                        w={gridData.xCellWidth} h={gridData.yCellHeight} piece={token.piece} color={token.color}
                        clicked={tokenClick}
                    />
                ))
            }
        </svg>
    )


