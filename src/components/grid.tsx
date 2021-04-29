import React, {FC, ReactElement, useState, useEffect} from "react";
import {flatten} from "lodash/fp";
import { Coordinate, GridData} from "../types";
import {inLegalCells} from "../utils";

export type GridProps = {
    gridData: GridData,
    legalCells: Coordinate[]
}

type CellProps = {
    x: number,
    y: number,
    color: string
}

export const Grid: FC<GridProps> = React.memo(({gridData, legalCells, children}): ReactElement => {

    const [cellsMap, setCellsMap] = useState<CellProps[][]>([]);

    useEffect(() => {
        const map = [];
        for (let x : number = 0; x < gridData.xWidthCells; x++) {
            const row = []
            for (let y: number = 0; y < gridData.yHeightCells; y++) {
                row.push({x, y, color: (x + y) % 2 === 0 ? "#D6B693" : "#966633"} as CellProps);
            }
            map[x] = row;
        }
        setCellsMap(map);
    }, [gridData])

    return (
        <g transform={`translate(${gridData.xOffset},${gridData.yOffset})`}>
            {
                flatten(cellsMap).map((cell: CellProps) => 
                    <rect key={`c${cell.x}${cell.y}`} x={cell.x * gridData.xCellWidth} y={cell.y * gridData.yCellHeight} width={gridData.xCellWidth}  height={gridData.yCellHeight} stroke="white" strokeWidth={0} fill={inLegalCells(legalCells, cell.x, cell.y) ? "red": cell.color}>
                            <animate attributeName="opacity"
                               to="0.5" begin="mouseover" dur="0.15s" fill="freeze"/>
                            <animate attributeName="stroke-width"
                               to="2" begin="mouseover" dur="0.15s" fill="freeze"/>

                            <animate attributeName="opacity"
                                to="1" begin="mouseout" dur="0.15s" fill="freeze"/>
                            <animate attributeName="stroke-width"
                               to="0" begin="mouseout" dur="0.15s" fill="freeze"/>
                               
                    </rect>
                )
            }
            {children}
        </g>
    )
})