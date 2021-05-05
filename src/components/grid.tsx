import React, {FC, ReactElement, useState, useEffect} from "react";
import { Coordinate} from "../types";
import {inLegalCells} from "../utils";
import { useGameContext } from "./game-context";

export type GridProps = {
    highlightCells: Coordinate[]
}

type CellProps = {
    x: number,
    y: number,
    color: string
}

export const Grid: FC<GridProps> = React.memo(({highlightCells, children}): ReactElement => {
    const ctx = useGameContext();
    const {grid} = ctx.state;
    const [cellsMap, setCellsMap] = useState<CellProps[][]>([]);

    useEffect(() => {
        const map = [];
        for (let x : number = 0; x < grid.xWidthCells; x++) {
            const row = []
            for (let y: number = 0; y < grid.yHeightCells; y++) {
                row.push({x, y, color: (x + y) % 2 === 0 ? "#D6B693" : "#966633"} as CellProps);
            }
            map[x] = row;
        }
        setCellsMap(map);
    }, [grid])

    return (
        <g transform={`translate(${grid.xOffset},${grid.yOffset})`}>
            {
                cellsMap.flat().map((cell: CellProps) => 
                    <>
                        <rect key={`c${cell.x}${cell.y}`} x={cell.x * grid.xCellWidth} y={cell.y * grid.yCellHeight} width={grid.xCellWidth}  height={grid.yCellHeight} stroke="white" strokeWidth={0} fill={inLegalCells(highlightCells, cell.x, cell.y) ? "red": cell.color}>
                                <animate attributeName="opacity"
                                to="0.5" begin="mouseover" dur="0.15s" fill="freeze"/>
                                <animate attributeName="stroke-width"
                                to="2" begin="mouseover" dur="0.15s" fill="freeze"/>

                                <animate attributeName="opacity"
                                    to="1" begin="mouseout" dur="0.15s" fill="freeze"/>
                                <animate attributeName="stroke-width"
                                to="0" begin="mouseout" dur="0.15s" fill="freeze"/>
                        </rect>
                        {/*<text x={cell.x * grid.xCellWidth + grid.xCellWidth/2} y={cell.y * grid.yCellHeight + grid.yCellHeight/2}>{cell.x},{cell.y}</text>*/}
                    </>
                )
            }
            {children}
        </g>
    )
})