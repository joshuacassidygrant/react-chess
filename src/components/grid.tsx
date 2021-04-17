
import React, {FC, ReactElement, useState, useEffect} from "react";
import {flatten} from "lodash/fp";

type GridProps = {
    height: number,
    width: number,
    xWidthCells: number,
    yHeightCells: number,
}

type CellProps = {
    x: number,
    y: number,
    color: string
}


export const Grid: FC<GridProps> = ({height, width, xWidthCells, yHeightCells, children}): ReactElement => {

    const [cellsMap, setCellsMap] = useState<CellProps[][]>([]);

    useEffect(() => {
        const map = [];
        for (let x : number = 0; x <xWidthCells; x++) {
            const row = []
            for (let y: number = 0; y < yHeightCells; y++) {
                row.push({x, y, color: (x + y) % 2 === 0 ? "#444499" : "#999944"} as CellProps);
            }
            map[x] = row;
        }
        setCellsMap(map);
    }, [height, width, xWidthCells, yHeightCells])

    const cellHeight = height/ yHeightCells;
    const cellWidth = width / xWidthCells;

    return (
        <>
            {
                flatten(cellsMap).map((cell: CellProps) => 
                    <rect x={cell.x * cellWidth} y={cell.y * cellHeight} width={cellWidth} height={cellHeight} fill={cell.color}/>
                )
            }
            {children}
        </>
    )
}