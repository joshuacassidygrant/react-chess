import React, {FC, ReactElement} from "react";
import {Grid} from "./grid";
import {Token} from "./token";
import {Pawn, Bishop, Knight, Queen, King, Rook} from  "./pieces/piece";

type BoardProps = {
    boardWidth: number,
    boardHeight: number,
    xWidthCells: number,
    yHeightCells: number
    
}

export const Board: FC<BoardProps> = ({boardWidth, boardHeight, xWidthCells, yHeightCells}): ReactElement => {
    return (
        <svg style={{width: boardWidth, height: boardHeight, margin: "50px auto"}}>
            <Grid height={boardHeight} width={boardWidth} xWidthCells={xWidthCells} yHeightCells={yHeightCells}/>
            <Token x={300} y={300} w={boardWidth/xWidthCells} h={boardHeight/yHeightCells} piece={Pawn} color="#f6f6f6"/>
            <Token x={200} y={200} w={boardWidth/xWidthCells} h={boardHeight/yHeightCells} piece={Bishop} color="#f6f6f6"/>
            <Token x={150} y={400} w={boardWidth/xWidthCells} h={boardHeight/yHeightCells} piece={Knight} color="#f6f6f6"/>
            <Token x={50} y={200} w={boardWidth/xWidthCells} h={boardHeight/yHeightCells} piece={Queen} color="#f6f6f6"/>
            <Token x={100} y={300} w={boardWidth/xWidthCells} h={boardHeight/yHeightCells} piece={King} color="#f6f6f6"/>
            <Token x={450} y={200} w={boardWidth/xWidthCells} h={boardHeight/yHeightCells} piece={Rook} color="#f6f6f6"/>
        </svg>
    )
}