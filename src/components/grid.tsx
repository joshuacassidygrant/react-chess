
import React, {FC, ReactElement, useState, useEffect} from "react";
import {flatten} from "lodash/fp";

type GridProps = {
    height: number,
    width: number,
    xWidthCells: number,
    yHeightCells: number,
    xOffset: number,
    yOffset: number
}

type CellProps = {
    x: number,
    y: number,
    color: string
}


export const Grid: FC<GridProps> = React.memo(({height, width, xWidthCells, yHeightCells, xOffset, yOffset, children}): ReactElement => {

    const [cellsMap, setCellsMap] = useState<CellProps[][]>([]);

    useEffect(() => {
        const map = [];
        for (let x : number = 0; x <xWidthCells; x++) {
            const row = []
            for (let y: number = 0; y < yHeightCells; y++) {
                row.push({x, y, color: (x + y) % 2 === 0 ? "#966633" : "#D6B693"} as CellProps);
            }
            map[x] = row;
        }
        setCellsMap(map);
    }, [height, width, xWidthCells, yHeightCells])

    const cellHeight = height/ yHeightCells;
    const cellWidth = width / xWidthCells;

    return (
        <g transform={`translate(${xOffset},${yOffset})`}>
            {
                flatten(cellsMap).map((cell: CellProps) => 
                    <rect key={`c${cell.x}${cell.y}`} x={cell.x * cellWidth} y={cell.y * cellHeight} width={cellWidth} stroke="white" strokeWidth={0} height={cellHeight} fill={cell.color}>
                            <animate attributeName="opacity"
                               to="0.5" begin="mouseover" dur="0.35s" fill="freeze"/>
                            <animate attributeName="stroke-width"
                               to="2" begin="mouseover" dur="0.15s" fill="freeze"/>

                            <animate attributeName="opacity"
                                to="1" begin="mouseout" dur="0.35s" fill="freeze"/>
                            <animate attributeName="stroke-width"
                               to="0" begin="mouseout" dur="0.15s" fill="freeze"/>
                               
                    </rect>
                )
            }
            {children}
        </g>
    )
})