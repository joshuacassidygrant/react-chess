import {FC, ReactElement, useState, useEffect} from "react";
import { useGameContext } from "./game-context";



export const RoomDisplay: FC = (): ReactElement => {
    const ctx = useGameContext();
    const {room} = ctx.state;

    return (<>
    <h3 style={{cursor: "pointer"}} onClick={() => {
        const temp: any = document.createElement("input");
        temp.value = room;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand("copy");
        document.body.removeChild(temp);
    }}>Room: {room}</h3>
    </>)


}