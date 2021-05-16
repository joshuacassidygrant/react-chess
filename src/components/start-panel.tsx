import {FC, ReactElement, useEffect, useState} from "react";
import {Flex, Box} from "rebass";
import { chooseRole, joinRoom, requestNewUser, requestRandomString, requestRoomData } from "../utils";
import { RandomButton } from "./random-button";
import { TextInput } from "./text-input";
import {useGameContext} from "./game-context";


export const StartPanel: FC = (): ReactElement => {
    const ctx = useGameContext();
    const {socket, room, user, roomUsers} = ctx.state;

    const [currentRoomInput, setCurrentRoomInput] = useState<string>(room ? room : "");
    const [currentNameInput, setCurrentNameInput] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const roomname = params.get("room");
        if (roomname) {
            setCurrentRoomInput(roomname);
            params.delete("room");
        } else if (currentRoomInput === "") {
            requestRandomString(3, (txt)=>{setCurrentRoomInput(txt)});
        }

        const name = params.get("name");
        if (name) {
            setCurrentNameInput(name);
            params.delete("name");
        } else if (currentNameInput === "") {
            requestRandomString(2, (txt)=>{setCurrentNameInput(txt)});
        }
        /*
        if (name && roomname) {
            joinRoom(socket, {roomname, name});
            ctx.dispatch({type: "change-room", payload: roomname})
            ctx.dispatch({type: "set-user", payload: {data: {name: name}, role: -1}});

            const url = new URL(window.location.href);
            url.searchParams.delete("room");
            url.searchParams.delete("name");
            window.history.replaceState(null, "Chess", url.toString())
        }*/
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    useEffect(() => {
        /*const params = new URLSearchParams(window.location.search);
        const roleString = params.get("role");
        if (roleString && user && room) {
            const role = parseInt(roleString);
            if ([0, 1, 2].includes(role) && roomUsers.length > 0 && (role === 2 || roomUsers.filter(el => el.role === role).length === 0)) {
                chooseRole(socket, room, role);
                ctx.dispatch({type: "set-user", payload: {name: user.name, socket: socket.id , role}});

                const url = new URL(window.location.href);
                url.searchParams.delete("role");
                window.history.replaceState(null, "Chess", url.toString())
            }
        }*/
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomUsers, user])

    return (
        <Flex p={2} width={600} mx="auto" my={50} bg="#499">
            {
                room === null ?
           (<Box width="100%">
               <h2>Join a Room</h2>
               <Flex justifyContent="space-between" mb={10}>
                   <Box width="45%">
                     <Box textAlign="left"><label>Room:</label></Box>
                     <Flex alignItems="center">
                        <TextInput style={{width: "100%"}} value={currentRoomInput} onChange={(e) => setCurrentRoomInput(e.target.value)}/>
                        <RandomButton click={() => {requestRandomString(3, (txt)=>{setCurrentRoomInput(txt)})}}/>
                     </Flex>
                   </Box>
                   <Box width="45%">
                    <Box textAlign="left"><label>Nickname:</label></Box>
                    <Flex alignItems="center">
                        <TextInput style={{width: "100%"}} value={currentNameInput} onChange={(e) => setCurrentNameInput(e.target.value)}/>
                        <RandomButton click={() => {requestRandomString(2, (txt)=>{setCurrentNameInput(txt)})}}/>
                    </Flex>
                   </Box>
               </Flex>

               <button onClick={() => {

                    requestNewUser(currentNameInput).then((res) => {
                        return res.json();
                    }).then(res => {
                        ctx.dispatch({type: "set-user", payload: res.user})
                        joinRoom(socket, currentRoomInput, res.user.id);
                        return requestRoomData(currentRoomInput);
                    }).then(res => {
                        return res.json();
                    }).then(res => {
                        console.log(res);
                        ctx.dispatch({type: "change-room", payload: res})
                    })
                }}>Join Room</button> 
            </Box>
            ) : (
            <Box>
                <div>
                    <button disabled={Array.from(roomUsers.values()).filter(el => el.role === 0).length > 0} onClick={() => {
                        if (!user || !room) return;
                        chooseRole(socket, user.id, room, 0); 
                        ctx.dispatch({type: "set-user-role", payload: {uid: user.id, role: 0}});
                    }}>Join as White</button>
                    <button disabled={Array.from(roomUsers.values()).filter(el => el.role === 1).length > 0} onClick={() => {
                        if (!user || !room) return;
                        chooseRole(socket, user.id, room, 1); 
                        ctx.dispatch({type: "set-user-role", payload: {uid: user.id, role: 1}});
                    }}>Join as Black</button>
                    <button onClick={() => {
                        if (!user || !room) return;
                        chooseRole(socket, user.id, room, 2); 
                        ctx.dispatch({type: "set-user-role", payload: {uid: user.id, role: 2}});
                    }}>Join as Spectator</button>
                    <button onClick={() => {setCurrentRoomInput(""); ctx.dispatch({type: "change-room", payload: null});}}>Leave Room</button>
                </div>
            </Box>)
            }
        </Flex>
    )

}