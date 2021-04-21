import React, {FC, ReactElement} from "react";
import {Players} from "../game/players";

type GameInfoProps = {
    turn: number
}

export const GameInfo: FC<GameInfoProps> = ({turn}): ReactElement => {

    return (
        <div>
            Turn {turn}, {Players[turn % 2].name}'s move.
        </div>
    );
};