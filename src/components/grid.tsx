
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


export const Grid: FC<GridProps> = ({height, width, xWidthCells, yHeightCells, xOffset, yOffset, children}): ReactElement => {

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
                    <rect key={`c${cell.x}${cell.y}`} x={cell.x * cellWidth} y={cell.y * cellHeight} width={cellWidth} height={cellHeight} fill={cell.color}/>
                )
            }
            {children}
        </g>
    )
}