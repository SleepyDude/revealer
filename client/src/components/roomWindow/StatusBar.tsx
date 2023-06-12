import React from 'react'
import './roomWindow.css';

function StatusBar({username} : {username: string, logout: any}) {
  return (
    <div className="status-bar">
        <div>
            Connected as: {username}
        </div>
        <a href="/">Exit room</a>
    </div>
  )
}

export default StatusBar