import React from 'react';
import profilePic from '../assets/loginn.png';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router';

const MyProfile = () => {
  const { user } = useAuth();
  const currentUser = user || {
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
            <div className="avatar">
              <div className="w-32 rounded-full ring ring-[#76b38f] ring-offset-base-100 ring-offset-2 overflow-hidden">
                <img 
                  src={currentUser.profile_pic || profilePic} 
                  alt={currentUser.username} 
                  onError={(e) => {
                    e.target.src = profilePic;
                  }}
                />
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <h3 className="text-2xl font-semibold text-[#76b38f]">
                {currentUser.f_name} {currentUser.l_name}
              </h3>
              <p className="text-lg">
                <span className="font-medium">Username:</span> {currentUser.username}
              </p>
              <p className="text-lg">
                <span className="font-medium">Email:</span> {currentUser.email}
              </p>
              {currentUser.mobile_no && (
                <p className="text-lg">
                  <span className="font-medium">Phone:</span> {currentUser.mobile_no}
                </p>
              )}
              {currentUser.dob && (
                <p className="text-lg">
                  <span className="font-medium">Date of Birth:</span> {new Date(currentUser.dob).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <Link to="/myProfile/edit" className="btn btn-primary">
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyProfile;