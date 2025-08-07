import React from 'react'
import { Outlet } from 'react-router'
import Logo from '../shared/Logo'

const Auth = () => {
  return (
    <div>
     
      <Outlet></Outlet>
    </div>
  )
}

export default Auth
