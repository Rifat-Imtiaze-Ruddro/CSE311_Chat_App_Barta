import React from 'react';
import profilePic from '../assets/loginn.png';

const MyProfile = () => {
  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user')) || {
    username: 'Guest',
    email: 'guest@example.com',
    f_name: 'Guest',
    l_name: 'User',
    profile_pic: profilePic
  };

  return (
    <section className="px-6 py-12 lg:px-20 bg-base-100 text-base-content">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-10">My Profile</h2>

        <div className="card bg-base-200 shadow-xl p-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-8">
            {/* Profile Image */}
            <div className="avatar">
              <div className="w-32 rounded-full ring ring-[#76b38f] ring-offset-base-100 ring-offset-2 overflow-hidden">
                <img 
                  src={user.profile_pic || profilePic} 
                  alt={user.username} 
                  onError={(e) => {
                    e.target.src = profilePic; // Fallback image
                  }}
                />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 space-y-3">
              <h3 className="text-2xl font-semibold text-[#76b38f]">
                {user.f_name} {user.l_name}
              </h3>
              <p className="text-lg">
                <span className="font-medium">Username:</span> {user.username}
              </p>
              <p className="text-lg">
                <span className="font-medium">Email:</span> {user.email}
              </p>
              {user.mobile_no && (
                <p className="text-lg">
                  <span className="font-medium">Phone:</span> {user.mobile_no}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyProfile;