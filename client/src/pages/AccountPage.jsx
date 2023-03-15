import React from 'react'
import { useContext } from 'react'
import { UserContext } from '../UserContext'
import { Navigate } from 'react-router-dom'

const AccountPage = () => {
  const {user} = useContext(UserContext)

  if (!user) {
    return <Navigate to={'/login'} />
  }

  return (
    <div>Account Page for {user.name}</div>
  )
}

export default AccountPage