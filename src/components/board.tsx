import React, {useState, FC, ReactElement} from "react";
import {Grid} from "./grid";
import {Token} from "./token";
import {Pawn, Bishop, Knight, Queen, King, Rook} from  "./pieces/piece";

type BoardProps = {
    boardWidth: number,
    boardHeight: number,
    xWidthCells: number,
    yHeightCells: number
    
}

export const Board: FC<BoardProps> = ({boardWidth, boardHeight, xWidthCells, yHeightCells}): ReactElement => {

    const white = "#eee";
    const black = "#111";

    const cellSize = {x: boardWidth/xWidthCells, y: boardHeight/yHeightCells}

    const [tokenMap, setTokenMap] = useState({
        p1: { xC: 1, yC: 3, piece: Pawn, color: white},
        b1: { xC: 3, yC: 4, piece: Bishop, color: black}
    });

    const [mousePos, setMousePos] = useState({
        x: 0, y:0
    })

    const [selectedToken, setSelectedToken] = useState<string>("");

    return (
        <svg style={{width: boardWidth, height: boardHeight, margin: "50px auto"}} 
            onMouseUp={() => {
                if(!selectedToken) return;
                setSelectedToken("");
                
            }}
            onMouseMove={(e) => {
                if (!selectedToken) return;
                setMousePos({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY});
            }}
        >
            <Grid height={boardHeight} width={boardWidth} xWidthCells={xWidthCells} yHeightCells={yHeightCells}/>
            {
                Object.entries(tokenMap).map(([id, token]) => (
                    <Token 
                        key={id} id={id} 
                        x={selectedToken === id ? mousePos.x : token.xC * cellSize.x} y={selectedToken === id ? mousePos.y : token.yC * cellSize.y} 
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