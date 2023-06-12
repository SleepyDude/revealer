import React, { useEffect, useState } from "react";
import StatusBar from "./roomWindow/StatusBar";
import UsersPanel from "./roomWindow/UsersPanel";

import { Socket, io } from 'socket.io-client'

let socket: Socket;

type Props = {
  username: string,
  roomNum: number,
}

export const Room = ({username, roomNum}: Props) => {
  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    socket = io('http://localhost:3000', { query: {
      roomNum: roomNum,
      username: username,
    }});

    socket.on(`onJoinRoom_${roomNum}`, (username: string) => {
      setUsers((users) => [...users, username]);
    });

    socket.on(`onLeaveRoom_${roomNum}`, (username: string) => {
      setUsers((users) => {
        return users.filter((auname) => auname !== username);
      });
    });

    socket.emit('loadRoom', (users: string[]) => {
      setUsers(() => users);
    })

    // const currentUser = JSON.parse(sessionStorage.getItem("user") ?? "");

    // if (currentUser) {
    //   setUser(currentUser);
    // }

    return () => {
      // sessionStorage.clear();
      // setUser(() => "");
      socket.off("onJoinRoom");
      socket.off("onLeaveRoom");
      // socket.off("connect");
      // socket.off("disconnect");
      socket.close();
    };
  }, []);

  // const logout = () => {
  //   setUser("");
  //   socket.emit("leaveRoom");
  // };



  return (
    <div className="room-layout">
      <p>User: {username}</p>
      <p>Room number: {roomNum}</p>
      <br></br>
      {/* <StatusBar username={user}/> */}
      <div className="main-panel">
        <UsersPanel users={users} />
        <div className="content-panel">content panel</div>
      </div>
    </div>
  );
};
