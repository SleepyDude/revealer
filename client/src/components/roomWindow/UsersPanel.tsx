import React from 'react'
import './roomWindow.css';

function UsersPanel({users}: {users: string[]}) {
  return (
    <div className='users-panel'>
      { users.map( (u, i) => <p key={i}>{u}</p> ) }
    </div>
  )
}

export default UsersPanel