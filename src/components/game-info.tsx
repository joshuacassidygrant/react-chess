import React, {FC, ReactElement} from "react";
import {Players} from "../game/players";
import {TokenData} from "../types";

type GameInfoProps = {
    turn: number,
    captured: TokenData[]
}

export const GameInfo: FC<GameInfoProps> = ({turn, captured}): ReactElement => {
    return (
        <div style={{margin: "24px 0"}}>
            <div>
                Turn {turn}, {Players[turn % 2].name}'s move.
            </div>
            <div style={{display:"flex"}}>
                <div style={{width:"50%", fontSize: "24px", color: "#999", height: "30px"}}>
                    CAPTURED: {captured.filter(t => t.player === 0).map(t => t.piece.symbol)}
                </div>
                <div style={{width:"50%", fontSize: "24px", color: "#000", height: "30px"}}>
                     {captured.filter(t => t.player === 1).map(t => t.piece.symbol)} :CAPTURED
                </div>
            </div>
        </div>
    );
};