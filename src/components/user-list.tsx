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
    const {roomUsers} = ctx.state;

    return (
        <StyledUserList>
            <h3>Users in this Room:</h3>
            <ul>
            {roomUsers.map(user => {
                return (
                    <li key={user.socket}>{user.name} ({roleToName(user.role)})</li>
                )
            })}
            </ul>
        </StyledUserList>
    )
}