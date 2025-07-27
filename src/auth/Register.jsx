import React from 'react'
import { Link } from 'react-router'
import Logo from '../shared/Logo'
import pic from '../assets/loginn.png'
const Register = () => {
     const handleRegister=() => {  }
    const handleGoogle=() => {  }
  return (
    <div className="hero bg-base-200 min-h-screen">
  <div className="hero-content bg-base-100 flex flex-row-reverse">
    <img src={pic} className='flex-1 hidden lg:block' alt="Login" />
    <div className="flex-1 card bg-base-100  w-full max-w-sm shrink-0 shadow-2xl">
       <div className="card-body">
         <Logo></Logo>
         <h1 className="text-5xl font-bold">Register now!</h1>
        <form onSubmit={handleRegister} className="fieldset">
          <label className="label">Name</label>
          <input type="text" name='name' className="input" placeholder="Name" />
          <label className="label">Email</label>
          <input type="email" name='email' className="input" placeholder="Email" />
          <label className="label">PhotoURL</label>
          <input type="url" name='photo' className="input" placeholder="PhotoURL" />
          <label className="label">Password</label>
          <input type="password" name='password' className="input" placeholder="Password" />
         
          <button className="btn btn-neutral mt-4">Register</button>
            <p className="text-sm  text-center mt-6">
            Already have an account?
            <Link to="/auth/login" className="text-primary hover:underline ml-1">Login</Link>
          </p>
        </form>
         <button onClick={handleGoogle} type="button" className="w-full flex items-center justify-center gap-3 btn border border-gray-300 bg-white text-black hover:bg-gray-100">
            <svg aria-label="Google logo" width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path fill="#EA4335" d="M256 192v128h71c-6 40-38 64-71 64-42 0-80-37-80-96s38-96 80-96c22 0 41 9 55 23l41-41C327 150 294 136 256 136c-66 0-128 54-128 120s62 120 128 120c71 0 122-49 122-120 0-8-1-16-2-24H256z" />
            </svg>
            <span>Continue with Google</span>
          </button>
              
      </div>
    </div>
  </div>
</div>
  )
}

export default Register
