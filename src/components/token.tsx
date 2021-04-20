import React, {FC, ReactElement} from "react";
import {TokenData} from  "../types";
import {Players} from "../game/players";

type TokenProps = {
    id: string,
    data: TokenData,
    w: number,
    h: number,
    clicked: (e: React.MouseEvent, id: string) => void
}

export const Token: FC<TokenProps> = React.memo(({id, data, w, h, clicked}): ReactElement => {
    const xs = w/256;
    const ys = h/256;
    const pos = data.getPosition();
    return (
        <g transform={`translate(${pos.x}, ${pos.y})`} onMouseDown={(e) => clicked(e, id)}>
            <circle fill="rgba(1,1,1,0.2)" r={w/2} cx={w/2} cy={h/2} />
            {
                data.piece.paths.map(path => (
                    <path transform={ `scale(${xs}, ${ys})`} d={path} fill={Players[data.player].color} />
                ))
            }
        </g>
    )
})
