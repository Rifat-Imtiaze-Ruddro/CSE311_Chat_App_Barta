import React from 'react';
import { Link } from 'react-router';
import Logo from '../shared/Logo';
import pic from '../assets/loginn.png';

const Register = () => {
  const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.target;

    const userData = {
      username: form.username.value,
      f_name: form.f_name.value,
      l_name: form.l_name.value,
      email: form.email.value,
      mobile_no: form.mobile_no.value,
      dob: form.dob.value,
      profile_pic: form.profile_pic.value || null,
      password: form.password.value
    };

    try {
      const res = await fetch('http://localhost/barta/api/auth/register.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      const result = await res.json();
      
      if (res.ok && result.success) {
        alert("Registration successful!");
        window.location.href = '/';
      } else {
        alert(result.message || "Registration failed");
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
            <h1 className="text-5xl font-bold">Register now!</h1>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="form-control">
                <label className="label">Username*</label>
                <input type="text" name="username" className="input input-bordered" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">First Name*</label>
                  <input type="text" name="f_name" className="input input-bordered" required />
                </div>
                <div className="form-control">
                  <label className="label">Last Name*</label>
                  <input type="text" name="l_name" className="input input-bordered" required />
                </div>
              </div>

              <div className="form-control">
                <label className="label">Email*</label>
                <input type="email" name="email" className="input input-bordered" required />
              </div>

              <div className="form-control">
                <label className="label">Mobile Number</label>
                <input type="tel" name="mobile_no" className="input input-bordered" />
              </div>

              <div className="form-control">
                <label className="label">Date of Birth*</label>
                <input type="date" name="dob" className="input input-bordered" required />
              </div>

              <div className="form-control">
                <label className="label">Profile Picture URL</label>
                <input type="url" name="profile_pic" className="input input-bordered" />
              </div>

              <div className="form-control">
                <label className="label">Password*</label>
                <input type="password" name="password" className="input input-bordered" required />
              </div>

              <button type="submit" className="btn btn-primary mt-6">Register</button>
              
              <p className="text-sm text-center mt-4">
                Already have an account?
                <Link to="/auth/login" className="link link-primary ml-1">Login</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;