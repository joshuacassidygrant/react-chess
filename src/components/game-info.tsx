import {FC, ReactElement} from "react";
import { Box } from "rebass";
import {Players} from "../game/players";
import { GameState } from "../types/gameState";
import {useGameContext} from "./game-context";

type GameInfoProps = {
    requestRestart: () => void
}


export const GameInfo: FC<GameInfoProps> = ({requestRestart}): ReactElement => {
    const ctx = useGameContext();
    const {currentGameState, user, turn} = ctx.state;

    const renderStatusLine = () => {
        switch(currentGameState) {
            case GameState.NOT_STARTED:
                return "New game! White moves first."
            case GameState.PLAYING:
                return `Turn ${turn}, ${Players[turn % 2].name}'s move.`
            case GameState.WHITE_WINS:
                return <>Checkmate. White wins! <button onClick={() => requestRestart()}>Play again?</button></>
            case GameState.BLACK_WINS:
                return <>Checkmate. Black wins! <button  onClick={() => requestRestart()}>Play again?</button></>
            case GameState.STALEMATE:
                return <>Stalemate! <button onClick={() => requestRestart()}>Play again?</button></>
            default:
                return "Error!";

        }
    }


    return (
        <Box width={1100} mx="auto" style={{margin: "24px 0"}}>
            <div>
                {renderStatusLine()}
            </div>
            <div style={{display:"flex"}}>
                <div style={{width:"50%", fontSize: "24px", color: "#999", height: "42px"}}>
                    WHITE {(user && user.role === 0) && "(YOU)"}<br/>
                    MATERIAL: {/*TODOcaptured.filter(t => t.player === 0).map((t, i) => <span key={i}>{t.piece.symbol}</span>)*/}
                </div>
                <div style={{width:"50%", fontSize: "24px", color: "#000", height: "42px"}}>
                BLACK {(user && user.role === 1) && "(YOU)"}<br/>
                MATERIAL:{/*captured.filter(t => t.player === 1).map(t => t.piece.symbol)TODO*/} 
                </div>
            </div>
        </Box>
    );
};