import React, { FC } from "react"
import { Box } from "rebass"
import styled from "styled-components"
import { User } from "../types"
import { roleToName } from "../utils"

type UserListProps = {
    users: User[]
}

const  StyledUserList = styled(Box)`
    ul {
        text-align: left;
        list-style-type: none;
    }
`;

export const UserList: FC<UserListProps> =  ({users}) => {
    return (
        <StyledUserList>
            <h3>Users in this Room:</h3>
            <ul>
            {users.map(user => {
                return (
                    <li key={user.socket}>{user.name} ({roleToName(user.role)})</li>
                )
            })}
            </ul>
        </StyledUserList>
    )
}