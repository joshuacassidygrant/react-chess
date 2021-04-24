import React, {FC, ReactElement} from "react";
import {Players} from "../game/players";
import {TokenData} from "../types";

type GameInfoProps = {
    turn: number,
    captured: TokenData[],
    currentPlayer: number,
    room: string
}

export const GameInfo: FC<GameInfoProps> = ({turn, captured, currentPlayer, room}): ReactElement => {
    return (
        <div style={{margin: "24px 0"}}>
            <div>
                Room: {room}, Turn {turn}, {Players[turn % 2].name}'s move.
            </div>
            <div style={{display:"flex"}}>
                <div style={{width:"50%", fontSize: "24px", color: "#999", height: "42px"}}>
                    WHITE {currentPlayer === 0 && "(YOU)"}<br/>
                    CAPTURED: {captured.filter(t => t.player === 0).map((t, i) => <span key={i}>{t.piece.symbol}</span>)}
                </div>
                <div style={{width:"50%", fontSize: "24px", color: "#000", height: "42px"}}>
                BLACK {currentPlayer === 1 && "(YOU)"}<br/>
                     {captured.filter(t => t.player === 1).map(t => t.piece.symbol)} :CAPTURED
                </div>
            </div>
        </div>
    );
};