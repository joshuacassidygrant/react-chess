import React, {useState, FC, ReactElement, useEffect} from "react";
import {getOr} from "lodash/fp";
import {Grid, GridProps, getGridCoordinates, coordinateInGridBounds} from "./grid";
import {Token} from "./token";
import {startState} from "./game/start";
import {Position, Coordinate} from "../types";
import {TokenMap, TokenData} from "../types";

type BoardProps = {
    boardWidth: number,
    boardHeight: number,
    xWidthCells: number,
    yHeightCells: number
    
}



export const Board: FC<BoardProps> = ({boardWidth, boardHeight, xWidthCells, yHeightCells}): ReactElement => {

    const [mousePos, setMousePos] = useState<Position>({
        x:0, y:0
    });
    const [legalCells, setLegalCells] = useState<Coordinate[]>([]);
    const [selectedToken, setSelectedToken] = useState<string>("");
    
    const [gridProps, setGridProps] = useState<GridProps>({
        id: "chessGrid",
        height: boardHeight, width: boardWidth, 
        xWidthCells: xWidthCells, yHeightCells: yHeightCells, 
        xCellWidth:  boardWidth/xWidthCells, yCellHeight: boardHeight/yHeightCells,
        xOffset: boardWidth/xWidthCells, yOffset: boardHeight/yHeightCells,
        legalCells});
    const [tokenMap, setTokenMap]= useState<TokenMap>(startState(gridProps));
    const [hoverCell, setHoverCell] = useState<Coordinate>({
        x:0, y:0, grid: gridProps
    });

    useEffect(() => {
        setGridProps(g => { return {...g, legalCells}});
    }, [legalCells])

    return (
        <svg style={{width: boardWidth + 2 * gridProps.xCellWidth, height: boardHeight + 2 * gridProps.yCellHeight, margin: `${gridProps.yCellHeight} auto`, backgroundColor:"#26312a"}} 
            onMouseUp={(e) => {
                if(!selectedToken) return;
                const tokenData: TokenData = tokenMap[selectedToken];

                if(!coordinateInGridBounds(hoverCell)) {
                    const pos = {x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY};
                    setTokenMap(updateTokenData(tokenMap, {[selectedToken]: tokenData.setPosAndReturn(pos)}));
                } else if (hoverCell != null) {
                    setTokenMap(updateTokenData(tokenMap, {[selectedToken]: tokenData.setCoordAndReturn(hoverCell)}));
                }

                setSelectedToken("");
                setLegalCells([]);
            }}
            onMouseMove={(e) => {
                if (!selectedToken) return;
                const pos = {x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY};
                setMousePos(pos);
                setHoverCell(getGridCoordinates(pos, gridProps));
                const token = getOr(null, selectedToken, tokenMap);
                if (!token) return;
                setLegalCells(token.piece.getLegalMoves(selectedToken, tokenMap, gridProps));
            }} 
        >
            <Grid {...gridProps}/>
            {
                Object.entries(tokenMap).map(([id, token]) => (
                    <Token 
                        key={id} id={id} 
                        x={selectedToken === id ? mousePos.x : token.getPosition().x} y={selectedToken === id ? mousePos.y : token.getPosition().y} 
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

function updateTokenData(map: TokenMap, changes: TokenMap): TokenMap {
    return {...map, ...changes};
}