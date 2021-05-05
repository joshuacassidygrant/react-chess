import {GridData} from "./gridData";

export type Coordinate = {
    x: number,
    y: number,
    grid: GridData    
}

export const coordinateSort = (a: Coordinate, b: Coordinate) => {
    if(a.grid.id !== b.grid.id) return (a.grid.id < b.grid.id) ? -1 : 1;
    if(a.x !== b.x) return (a.x < b.x) ? -1 : 1;
    return (a.y < b.y) ? -1 : 1;
}