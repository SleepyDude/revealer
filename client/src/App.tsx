import { useState } from 'react'
import './App.css'
import { LoginForm } from './components';
import { Room } from './components/Room';
import type { User } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [roomNum, setRoomNum] = useState<number>(0);
  
  return (
    <>
      { user ? (
          <Room username={user.username} roomNum={roomNum}/>
      ) : (
        <LoginForm onSubmit={props => {
          setUser({username: props.username});
          setRoomNum(props.roomNum);
        }}/>
      )}
    </>
  )
}

export default App
