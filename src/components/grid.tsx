
import React, {FC, ReactElement, useState, useEffect} from "react";
import {flatten} from "lodash/fp";
import {Position, Coordinate} from "../types";

export type GridProps = {
    height: number,
    width: number,
    xWidthCells: number,
    yHeightCells: number,
    xOffset: number,
    yOffset: number,
    xCellWidth: number,
    yCellHeight: number,
    legalCells: Coordinate[]
}

type CellProps = {
    x: number,
    y: number,
    color: string
}


export const Grid: FC<GridProps> = React.memo(({height, width, xWidthCells, yHeightCells, xOffset, yOffset, xCellWidth, yCellHeight, legalCells, children}): ReactElement => {

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

    return (
        <g transform={`translate(${xOffset},${yOffset})`}>
            {
                flatten(cellsMap).map((cell: CellProps) => 
                    <rect key={`c${cell.x}${cell.y}`} x={cell.x * xCellWidth} y={cell.y * yCellHeight} width={xCellWidth}  height={yCellHeight} stroke="white" strokeWidth={0} fill={inLegalCells(legalCells, cell.x, cell.y) ? "red": cell.color}>
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

export function gridQuantizePosition(pos: Position, grid: GridProps): Position {
    return {x:pos.x - (pos.x % grid.xCellWidth) + grid.xOffset, y:pos.y - (pos.y % grid.yCellHeight) + grid.yOffset};
}

export function getGridCoordinates(pos: Position, grid: GridProps): Coordinate {
    return {x: Math.floor((pos.x - grid.xOffset)/grid.xCellWidth), y: Math.floor((pos.y - grid.yOffset)/grid.yCellHeight), grid};
}

export function getPositionFromCoordinates(coords: Coordinate): Position {
    return {x: coords.x * coords.grid.xCellWidth + coords.grid.xOffset, y: coords.y * coords.grid.yCellHeight + coords.grid.yOffset};
}

export function inLegalCells(legalCells: Coordinate[], x: number, y: number): boolean {
    return !!legalCells.find(c => c.x === x && c.y === y);
}

export function inGridBounds(pos: Position, grid: GridProps): boolean {
    return coordinateInGridBounds(getGridCoordinates(pos, grid));
    
}

export function coordinateInGridBounds(coords: Coordinate): boolean {
    return coords.x >= 0 && coords.y >= 0 && coords.x < coords.grid.xWidthCells && coords.y < coords.grid.yHeightCells;
}
