import React, {FC, ReactElement} from "react";
import { Box } from "rebass";
import {Players} from "../game/players";
import {TokenData, User} from "../types";
import { GameState } from "../types/gameState";

type GameInfoProps = {
    turn: number,
    captured: TokenData[],
    currentPlayer: User | null,
    currentState: GameState,
    requestRestart: () => void
}

export const GameInfo: FC<GameInfoProps> = ({turn, captured, currentPlayer, currentState, requestRestart}): ReactElement => {
    return (
        <Box width={1100} mx="auto" style={{margin: "24px 0"}}>
            <div>
                {
                    currentState === GameState.NOT_STARTED ? ("New game! White moves first.") :
                    currentState === GameState.PLAYING ?  (`Turn ${turn}, ${Players[turn % 2].name}'s move.`):
                    currentState === GameState.WHITE_WINS ? (<>Checkmate. White wins! <a href="#" onClick={() => requestRestart()}>Play again?</a></>) :
                    currentState === GameState.BLACK_WINS ? (<>Checkmate. Black wins! <a href="#" onClick={() => requestRestart()}>Play again?</a></>) :
                    currentState === GameState.STALEMATE ? (<>Stalemate! <a href="#" onClick={() => requestRestart()}>Play again?</a></>) : "Error!" 
                }
            </div>
            <div style={{display:"flex"}}>
                <div style={{width:"50%", fontSize: "24px", color: "#999", height: "42px"}}>
                    WHITE {(currentPlayer && currentPlayer.role === 0) && "(YOU)"}<br/>
                    CAPTURED: {captured.filter(t => t.player === 0).map((t, i) => <span key={i}>{t.piece.symbol}</span>)}
                </div>
                <div style={{width:"50%", fontSize: "24px", color: "#000", height: "42px"}}>
                BLACK {(currentPlayer && currentPlayer.role === 1) && "(YOU)"}<br/>
                     {captured.filter(t => t.player === 1).map(t => t.piece.symbol)} :CAPTURED
                </div>
            </div>
        </Box>
    );
};