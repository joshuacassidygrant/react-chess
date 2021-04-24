import React, { FC } from "react"
import { Box } from "rebass"
import { User } from "../types"
import { roleToName } from "../utils"

type UserListProps = {
    users: User[]
}

export const UserList: FC<UserListProps> =  ({users}) => {
    return (
        <Box>
            <h3>Users in this Room:</h3>
            <ul>
            {users.map(user => {
                return (
                    <li key={user.socket}>{user.name} ({roleToName(user.role)})</li>
                )
            })}
            </ul>
        </Box>
    )
}