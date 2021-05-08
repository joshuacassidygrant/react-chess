import {FC, ReactElement} from "react";
import { Box } from "rebass";
import {Players} from "../game/players";
import { startState } from "../game/start";
import { GameState } from "../types/gameState";
import {useGameContext} from "./game-context";

type MaterialLineProps = {
    player: number
}

const MaterialLine: FC<MaterialLineProps> = ({player}) : ReactElement => {
    const ctx = useGameContext();
    const {tokenMap, grid,} = ctx.state;
    const start = startState(grid);
    const materialValue = Object.values(tokenMap).filter(v => v.player === player).map(v => v.getPiece().pointValue).reduce((tot, num) => {return tot + num}, 0)
    return (<> ({materialValue})
        {Object.keys(start).filter(k => start[k].player === player).map(k => 
             <span key={k} style={{color: k in tokenMap ? "inherit" : "red"}}>{k in tokenMap ? tokenMap[k].getPiece().symbol : start[k].getPiece().symbol}</span>
        )}
    </>)
}


export const GameInfo: FC = (): ReactElement => {
    const ctx = useGameContext();
    const {currentGameState, user, turn, socket, room} = ctx.state;

    const renderStatusLine = () => {
        switch(currentGameState) {
            case GameState.NOT_STARTED:
                return "New game! White moves first."
            case GameState.PLAYING:
                return `Turn ${turn}, ${Players[turn % 2].name}'s move.`
            case GameState.WHITE_WINS:
                return <>Checkmate. White wins! <button onClick={() =>socket.emit("request-restart", room)}>Play again?</button></>
            case GameState.BLACK_WINS:
                return <>Checkmate. Black wins! <button  onClick={() =>socket.emit("request-restart", room)}>Play again?</button></>
            case GameState.STALEMATE:
                return <>Stalemate! <button onClick={() =>socket.emit("request-restart", room)}>Play again?</button></>
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
                <div style={{width:"50%", fontSize: "22px", color: "#999", height: "42px"}}>
                    WHITE {(user && user.role === 0) && "(YOU)"}<br/>
                    MATERIAL: <MaterialLine player={0} />
                </div>
                <div style={{width:"50%", fontSize: "22px", color: "#000", height: "42px"}}>
                    BLACK {(user && user.role === 1) && "(YOU)"}<br/>
                    MATERIAL: <MaterialLine player={1} /> 
                </div>
            </div>
        </Box>
    );
};