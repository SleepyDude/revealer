import { useEffect, useState } from 'react'
import './App.css'
import { Socket, io } from 'socket.io-client'
import { LoginLayout, RoomLayout } from './layouts'
import { LoginForm } from './components';

type ServerToClientEvents = any;
type ClientToServerEvents = any;

const socket: Socket = io('http://localhost:3000');

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [users, setUsers] = useState<string[]>([]);
  const [user, setUser] = useState<any>();

  useEffect(() => {
    const currentUser = JSON.parse(sessionStorage.getItem('user') ?? '{}');

    if (currentUser.userId) {
      setUser(currentUser);
    }

    socket.on('connect', () => {
      setIsConnected(true);
    })

    socket.on('disconnect', () => {
      setIsConnected(false);
    })

    socket.on('onJoinRoom', (username: any) => {
      console.log(`${username} joined Room`);
      
      setUsers((users) => {
        console.log(`onJoinRoom, users: ${users}`);
        return [...users, username];
      });
      console.log(`users after: ${users}`);
    })

    socket.on('onLeaveRoom', (username: any) => {
      // console.log(`${username} leave Room`);
      console.log(`onLeaveRoom, users: ${users}`);
      // const newUsers = users.filter( auname => auname !== username );

      // console.log(newUsers);
      setUsers((users) => {
        return users.filter( auname => auname !== username );
      });
    })

    // socket.on('chat', (e) => {
    //   setMessages((messages) => [e, ...messages]);
    // })

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('onJoinRoom');
      socket.off('onLeaveRoom');
      // socket.off('chat');
      // socket.close();
    }
  }, []);

  const login = (e: React.FormEvent<HTMLFormElement>) => {
    const target = e.target as typeof e.target & {
      name: { value: string };
    };

    const newUser = {
      userId: target.name.value,
      userName: target.name.value,
    }
    sessionStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);

    socket.emit('joinRoom', {
      user: newUser,
    });

    socket.emit('loadRoom', (serverUsers: string[]) => {
      console.log(`[loadRoom] serverUsers: ${serverUsers} users: ${users}`);
      setUsers(() => serverUsers);
    })
  }

  return (
    <>
      { user && user.userId ? (
          <RoomLayout user={user} isConnected={isConnected} users={users}>
            <div>
              { 
                users.map( (u, i) => <p key={i}>{u}</p> )
              }
            </div>
          </RoomLayout>
      ) : (
        <LoginLayout>
          <LoginForm login={login}/>
        </LoginLayout>
      )}
    </>
  )
}

export default App
