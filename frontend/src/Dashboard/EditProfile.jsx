import React from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import pic from '../assets/loginn.png';

const EditProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const updatedData = {
      username: user.username, // Keep original username
      f_name: form.f_name.value,
      l_name: form.l_name.value,
      mobile_no: form.mobile_no.value || null,
      dob: form.dob.value,
      profile_pic: form.profile_pic.value || null
    };

    try {
      const res = await fetch('http://localhost/barta/api/edit_profile.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedData)
      });

      const result = await res.json();
      
      if (res.ok && result.success) {
        alert("Profile updated successfully!");
        navigate('/myProfile');
      } else {
        alert(result.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <section className="px-6 py-12 lg:px-20 bg-base-100 text-base-content">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-10">Edit Profile</h2>

        <div className="card bg-base-200 shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">First Name*</span>
                </label>
                <input 
                  type="text" 
                  name="f_name" 
                  className="input input-bordered" 
                  defaultValue={user?.f_name || ''}
                  required 
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Last Name*</span>
                </label>
                <input 
                  type="text" 
                  name="l_name" 
                  className="input input-bordered" 
                  defaultValue={user?.l_name || ''}
                  required 
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Mobile Number</span>
              </label>
              <input 
                type="tel" 
                name="mobile_no" 
                className="input input-bordered" 
                defaultValue={user?.mobile_no || ''}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Date of Birth*</span>
              </label>
              <input 
                type="date" 
                name="dob" 
                className="input input-bordered" 
                defaultValue={user?.dob || ''}
                required 
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Profile Picture URL</span>
              </label>
              <input 
                type="url" 
                name="profile_pic" 
                className="input input-bordered" 
                defaultValue={user?.profile_pic || ''}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="form-control mt-6">
              <div className="flex justify-end space-x-4">
                <button 
                  type="button" 
                  onClick={() => navigate('/myProfile')}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default EditProfile;