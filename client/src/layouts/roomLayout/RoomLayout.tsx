import React from 'react'
import './roomLayout.css'

export function RoomLayout({ children }: any) { 
  return (
    <div className='room-layout'>
      { children }
    </div>
  )
}