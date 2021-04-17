import React, {FC, ReactElement} from "react";
import {Grid} from "./grid";

type BoardProps = {
    boardWidth: number,
    boardHeight: number,
    xWidthCells: number,
    yHeightCells: number
    
}

export const Board: FC<BoardProps> = ({boardWidth, boardHeight, xWidthCells, yHeightCells}): ReactElement => {
    return (
        <div style={{width: boardWidth, height: boardHeight, margin: "50px auto"}}>
            <Grid height={boardHeight} width={boardWidth} xWidthCells={xWidthCells} yHeightCells={yHeightCells} />
        </div>
    )
}