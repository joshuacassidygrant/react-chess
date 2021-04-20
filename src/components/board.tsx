import React, {FC, ReactElement} from "react";
import {Grid} from "./grid";
import {Token} from "./token";
import {GridData, TokenMap, Coordinate} from "../types";

type BoardProps = {
    tokenMap: TokenMap,
    gridData: GridData,
    mouseMove: (e: React.MouseEvent) => void,
    mouseUp: (e: React.MouseEvent) => void,
    tokenClick: (e: React.MouseEvent, id: string) => void,
    legalCells: Coordinate[]
}

export const Board: FC<BoardProps> = ({tokenMap, gridData, mouseMove, mouseUp, tokenClick, legalCells}): ReactElement => 
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
                        data={token}
                        w={gridData.xCellWidth} h={gridData.yCellHeight}
                        clicked={tokenClick}
                    />
                ))
            }
        </svg>
    )


