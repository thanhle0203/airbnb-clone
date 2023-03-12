
import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'

export const Layout = () => {
  return (
    <div className='p-4'>
        <Header />
        <Outlet />
    </div>
  )
}
