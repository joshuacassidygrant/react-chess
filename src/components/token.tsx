import React, {FC, ReactElement} from "react";
import {Piece} from  "./pieces/piece";

type TokenProps = {
    id: string,
    x: number,
    y: number,
    w: number,
    h: number,
    color: string,
    piece: Piece,
    clicked: (e: React.MouseEvent, id: string) => void
}

export const Token: FC<TokenProps> = ({id, x, y, color, piece, w, h, clicked}): ReactElement => {
    const xs = w/256;
    const ys = h/256;

    return (
        <g transform={`translate(${x}, ${y})`} onMouseDown={(e) => clicked(e, id)}>
            <circle fill="rgba(1,1,1,0.2)" r={w/2} cx={w/2} cy={h/2} />
            {
                piece.paths.map(path => (
                    <path transform={ `scale(${xs}, ${ys})`} d={path} fill={color} />
                ))
            }
        </g>
    )
}
