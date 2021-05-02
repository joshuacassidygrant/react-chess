import React, {FC, ReactElement} from "react";
import {Grid} from "./grid";
import {Token} from "./token";
import {Coordinate} from "../types";
import { useGameContext } from "./game-context";

type BoardProps = {
    mouseMove: (e: React.MouseEvent) => void,
    mouseUp: (e: React.MouseEvent) => void,
    tokenClick: (e: React.MouseEvent, id: string) => void,
    highlightCells: Coordinate[]
}

export const Board: FC<BoardProps> = ({mouseMove, mouseUp, tokenClick, highlightCells}): ReactElement => 
{
    const ctx = useGameContext();
    const {grid, tokenMap} = ctx.state;
    return (
        <svg style={{width: grid.width + 2 * grid.xCellWidth, height: grid.height + 2 * grid.yCellHeight, margin: `0 auto`, backgroundColor:"#26312a"}} 
            onMouseUp={mouseUp}
            onMouseMove={mouseMove} 
        >
            <Grid highlightCells={highlightCells}/>
            {
                Object.entries(tokenMap).map(([id, token]) => (
                    <Token 
                        key={id} id={id} 
                        data={token}
                        w={grid.xCellWidth} h={grid.yCellHeight}
                        clicked={tokenClick}
                    />
                ))
            }
        </svg>
    )}


