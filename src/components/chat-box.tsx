import {FC, ReactElement, useEffect, useState} from "react";
import {Flex, Box} from "rebass";
import styled from "styled-components";
import {Chat} from "../types";
import { sendChat } from "../utils";
import { TextInput } from "./text-input";
import {execute, isLegalFunctionSyntax} from "../utils/command";
import {useGameContext} from "../components/game-context";


const StyledChatBox = styled(Box)`
    position: relative;
    overflow: hidden;
    .message-scroll {
        padding: 20px;
        overflow-y: scroll;
        height: 100%;
        max-height: 100%;
        p {
            text-align: left;
        }
    }  
`;

const StyledChatInput = styled(Flex)`
    position: absolute;
    bottom: 10px;
    left: 10px;
    right: 10px;
    width: calc(100% - 30px);
    height: 30px;
`;

export const ChatBox : FC = (): ReactElement => {
    const ctx = useGameContext();
    const {room, socket, user} = ctx.state;

    const [messages, setMessages] = useState<Chat[]>([]);
    const [currentInput, setCurrentInput] = useState("");

    useEffect(() => {
        socket.on("approved-chat", function(chat: any) {
            setMessages(messages => [...messages, {message: chat.message, username: chat.username}])
        });
    

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Flex width={300} style={{border: "1px solid #888"}} flexDirection="column" justifyContent="space-between">
            <StyledChatBox height="400px">
                <Box className="message-scroll">
                    {
                        messages.map((m, i) => (
                            <p key={i}><b>{m.username}: </b>{m.message}</p>
                        ))
                    }
                </Box>

                <StyledChatInput>
                    <form style={{width: "100%"}} onSubmit={(e) =>{ e.preventDefault(); return false;}}>
                        <TextInput style={{width: "2fr"}} value={currentInput} onChange={(e) => setCurrentInput(e.target.value)}/>
                        <input type="submit" style={{  height:"30px", width: "70px"}} onClick={(e) => {
                            if (currentInput === "") return;
                            setCurrentInput("");
                            if (isLegalFunctionSyntax(currentInput)) {
                                const output = execute(currentInput, ctx);
                                setMessages(messages => [...messages, {message: output, username: user ? user.data.name : "Unknown:"}])
                            } else {
                                if (!room) return;
                                sendChat(socket, room, user ? user.data.name : "Unknown", currentInput);
                            }
                        }}/>
                    </form>
                </StyledChatInput>
            </StyledChatBox>

        </Flex>

    )
}