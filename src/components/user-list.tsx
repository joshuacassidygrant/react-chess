import React, { FC } from "react"
import { Box } from "rebass"
import { User } from "../types"

type UserListProps = {
    users: User[]
}

export const UserList: FC<UserListProps> =  ({users}) => {
    return (
        <Box>
            <ul>
            {users.map(user => {
                return (
                    <li key={user.socket}>{user.name}</li>
                )
            })}
            </ul>
        </Box>
    )
}