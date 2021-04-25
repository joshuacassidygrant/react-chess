import React, {FC, ReactElement, useEffect, useState} from "react";
import {Flex, Box} from "rebass";
import styled from "styled-components";
import {Chat} from "../types";
import { sendChat } from "../utils";

type ChatProps = {
    socket: any
    room: string,
    username: string
}

const StyledChatBox = styled(Box)`
    padding: 20px;
    overflow-y: scroll;
    p {
        text-align: left;
    }
`;

export const ChatBox : FC<ChatProps> = ({socket, room, username}): ReactElement => {

    const [messages, setMessages] = useState<Chat[]>([]);
    const [currentInput, setCurrentInput] = useState("");

    useEffect(() => {
        socket.on("approved-chat", function(chat: any) {
           setMessages(messages => [...messages, {message: chat.message, username: chat.username}])
        });
    }, []);

    return (
        <Flex width={300} style={{border: "1px solid #888"}} flexDirection="column" justifyContent="space-between">
            <StyledChatBox height="400px">
                {
                    messages.map((m, i) => (
                        <p key={i}><b>{m.username}: </b>{m.message}</p>
                    ))
                }
            </StyledChatBox>
            <Flex width="100%">
                <input style={{width: "300px"}} value={currentInput} onChange={(e) => setCurrentInput(e.target.value)}/>
                <button  style={{width: "100px"}} onClick={(e) => {
                    if (currentInput === "") return;
                    sendChat(socket, room, username, currentInput);
                    setCurrentInput("");
                    
                }}>Submit</button>
            </Flex>
        </Flex>
        
    )
}