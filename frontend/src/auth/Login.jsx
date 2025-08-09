import React from 'react';
import { Link } from 'react-router';
import Logo from '../shared/Logo';
import pic from '../assets/loginn.png';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    const form = e.target;

    const loginData = {
      username: form.username.value,
      password: form.password.value
    };

    try {
      const res = await fetch('http://localhost/barta/api/auth/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData)
      });

      const result = await res.json();

      if (res.ok && result.success) {
        login(result.user);
        window.location.href = '/';
      } else {
        alert(result.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content bg-base-100 flex flex-row-reverse">
        <img src={pic} className='flex-1 hidden lg:block' alt="Login" />
        <div className="flex-1 card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <div className="card-body">
            <Logo />
            <h1 className="text-5xl font-bold">Login now!</h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="form-control">
                <label className="label">Username*</label>
                <input type="text" name="username" className="input input-bordered" required />
              </div>

              <div className="form-control">
                <label className="label">Password*</label>
                <input type="password" name="password" className="input input-bordered" required />
              </div>

              <button type="submit" className="btn btn-primary mt-6">Login</button>
              
              <p className="text-sm text-center mt-4">
                Don't have an account?
                <Link to="/auth/register" className="link link-primary ml-1">Register</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;