import { FC } from "react"
import { Box } from "rebass"
import styled from "styled-components"
import { roleToName } from "../utils"
import {useGameContext} from "./game-context";

const  StyledUserList = styled(Box)`
    ul {
        text-align: left;
        list-style-type: none;
    }
`;

export const UserList: FC =  () => {
    const ctx = useGameContext();
    const state = ctx.state;
    const roomUsers: any = state.roomUsers;
    const roomUserKeys: string[] = Array.from(roomUsers.keys());
    console.log(roomUserKeys);
    return (
        <StyledUserList>
            <h3>Users in this Room:</h3>
            <ul>
            {roomUserKeys.map((uid: string) => {
                const user = roomUsers.get(uid);
                return (
                    <li key={uid}>{user.data.name} ({roleToName(user.role)})</li>
                )
            })}
            </ul>
        </StyledUserList>
    )
}