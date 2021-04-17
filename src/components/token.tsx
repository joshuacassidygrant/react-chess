import React, {FC, ReactElement} from "react";
import {Piece} from  "./pieces/piece";

type TokenProps = {
    x: number,
    y: number,
    w: number,
    h: number,
    color: string
    piece: Piece
}

export const Token: FC<TokenProps> = ({x, y, color, piece, w, h}): ReactElement => {
    const xs = w/256;
    const ys = h/256;
    return (
        <g transform={`translate(${x}, ${y})`} onClick={(e) => {console.log(e)}}>
            <circle fill="rgba(1,1,1,0.2)" r={w/2} cx={w/2} cy={h/2} />
            {
                piece.paths.map(path => (
                    <path transform={ `scale(${xs}, ${ys})`} d={path} fill={color} />
                ))
            }
        </g>
    )
}
