import React, {useState, FC, ReactElement} from "react";
import {getOr} from "lodash/fp";
import {Grid, GridProps, getGridCoordinates} from "./grid";
import {Token} from "./token";
import {startState} from "./game/start";
import {Position, Coordinate} from "../types";

type BoardProps = {
    boardWidth: number,
    boardHeight: number,
    xWidthCells: number,
    yHeightCells: number
    
}


export const Board: FC<BoardProps> = ({boardWidth, boardHeight, xWidthCells, yHeightCells}): ReactElement => {

    const [gridProps] = useState<GridProps>({
        height: boardHeight, width: boardWidth, 
        xWidthCells: xWidthCells, yHeightCells: yHeightCells, 
        xCellWidth:  boardWidth/xWidthCells, yCellHeight: boardHeight/yHeightCells,
        xOffset: boardWidth/xWidthCells, yOffset: boardHeight/yHeightCells});
    const [tokenMap, setTokenMap] = useState(startState);
    const [mousePos, setMousePos] = useState<Position>({
        x:0, y:0
    });
    const [hoverCell, setHoverCell] = useState<Coordinate>({
        x:0, y:0, grid: gridProps
    });
    const [selectedToken, setSelectedToken] = useState<string>("");

    return (
        <svg style={{width: boardWidth + 2 * gridProps.xCellWidth, height: boardHeight + 2 * gridProps.yCellHeight, margin: `${gridProps.yCellHeight} auto`, backgroundColor:"#26312a"}} 
            onMouseUp={() => {
                if(!selectedToken) return;
                setSelectedToken("");
                setTokenMap({...tokenMap, [selectedToken]: {...getOr({}, selectedToken, tokenMap), coord: {...hoverCell}}});
            }}
            onMouseMove={(e) => {
                if (!selectedToken) return;
                const pos = {x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY};
                setMousePos(pos);
                setHoverCell(getGridCoordinates(pos, gridProps));
            }} 
        >
            <Grid {...gridProps}/>
            {
                Object.entries(tokenMap).map(([id, token]) => (
                    <Token 
                        key={id} id={id} 
                        x={selectedToken === id ? mousePos.x : token.coord.x * gridProps.xCellWidth} y={selectedToken === id ? mousePos.y : token.coord.y * gridProps.yCellHeight} 
                        w={gridProps.xCellWidth} h={gridProps.yCellHeight} piece={token.piece} color={token.color}
                        clicked={(e, id) =>{
                            setMousePos({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY});
                            setSelectedToken(id);
                        }}
                    />
                ))
            }
           
        </svg>
    )
}