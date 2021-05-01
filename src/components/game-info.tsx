import React, {FC, ReactElement} from "react";
import { Box } from "rebass";
import {Players} from "../game/players";
import {TokenData, User} from "../types";
import { GameState } from "../types/gameState";
import {useGameContext} from "./game-context";

type GameInfoProps = {
    turn: number,
    captured: TokenData[],
    requestRestart: () => void
}

export const GameInfo: FC<GameInfoProps> = ({turn, captured, requestRestart}): ReactElement => {
    const ctx = useGameContext();
    const {currentGameState, user} = ctx.state;

    return (
        <Box width={1100} mx="auto" style={{margin: "24px 0"}}>
            <div>
                {
                    currentGameState === GameState.NOT_STARTED ? ("New game! White moves first.") :
                    currentGameState === GameState.PLAYING ?  (`Turn ${turn}, ${Players[turn % 2].name}'s move.`):
                    currentGameState === GameState.WHITE_WINS ? (<>Checkmate. White wins! <button onClick={() => requestRestart()}>Play again?</button></>) :
                    currentGameState === GameState.BLACK_WINS ? (<>Checkmate. Black wins! <button  onClick={() => requestRestart()}>Play again?</button></>) :
                    currentGameState === GameState.STALEMATE ? (<>Stalemate! <button onClick={() => requestRestart()}>Play again?</button></>) : "Error!" 
                }
            </div>
            <div style={{display:"flex"}}>
                <div style={{width:"50%", fontSize: "24px", color: "#999", height: "42px"}}>
                    WHITE {(user && user.role === 0) && "(YOU)"}<br/>
                    CAPTURED: {captured.filter(t => t.player === 0).map((t, i) => <span key={i}>{t.piece.symbol}</span>)}
                </div>
                <div style={{width:"50%", fontSize: "24px", color: "#000", height: "42px"}}>
                BLACK {(user && user.role === 1) && "(YOU)"}<br/>
                     {captured.filter(t => t.player === 1).map(t => t.piece.symbol)} :CAPTURED
                </div>
            </div>
        </Box>
    );
};