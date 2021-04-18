import React, {useState, FC, ReactElement} from "react";
import {getOr} from "lodash/fp";
import {Grid} from "./grid";
import {Token} from "./token";
import {startState} from "./game/start";

type BoardProps = {
    boardWidth: number,
    boardHeight: number,
    xWidthCells: number,
    yHeightCells: number
    
}
 
type Position = {
    x: number,
    y: number
}

type Coordinate = {
    x: number,
    y: number    
}

export const Board: FC<BoardProps> = ({boardWidth, boardHeight, xWidthCells, yHeightCells}): ReactElement => {

    const white = "#eee";
    const black = "#111";

    const cellSize = {x: boardWidth/xWidthCells, y: boardHeight/yHeightCells}

    const [tokenMap, setTokenMap] = useState(startState);

    const [mousePos, setMousePos] = useState<Position>({
        x:0, y:0
    })
    const [hoverCell, setHoverCell] = useState<Coordinate>({
        x:0, y:0
    })
    const [selectedToken, setSelectedToken] = useState<string>("");

    return (
        <svg style={{width: boardWidth, height: boardHeight, margin: "50px auto"}} 
            onMouseUp={() => {
                if(!selectedToken) return;
                setSelectedToken("");
                setTokenMap({...tokenMap, [selectedToken]: {...getOr({}, selectedToken, tokenMap), coord: {...hoverCell}}});
            }}
            onMouseMove={(e) => {
                if (!selectedToken) return;
                const pos = {x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY};
                setMousePos(pos);
                setHoverCell(getGridCoordinates(pos, cellSize.x, cellSize.y));
                console.log(getGridCoordinates(pos, cellSize.x, cellSize.y));
            }}
        >
            <Grid height={boardHeight} width={boardWidth} xWidthCells={xWidthCells} yHeightCells={yHeightCells}/>
            {
                Object.entries(tokenMap).map(([id, token]) => (
                    <Token 
                        key={id} id={id} 
                        x={selectedToken === id ? mousePos.x : token.coord.x * cellSize.x} y={selectedToken === id ? mousePos.y : token.coord.y * cellSize.y} 
                        w={cellSize.x} h={cellSize.y} piece={token.piece} color={token.color}
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

function gridQuantizePosition(pos: Position, cellWidth: number, cellHeight: number): Position {
    return {x:pos.x - pos.x % cellWidth, y:pos.y - pos.y % cellHeight};
}

function getGridCoordinates(pos: Position, cellWidth: number, cellHeight: number): Coordinate {
    return {x: Math.floor(pos.x/cellWidth), y: Math.floor(pos.y/cellHeight)};
}