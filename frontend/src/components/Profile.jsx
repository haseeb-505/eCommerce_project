import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import { useSelector } from 'react-redux';

const Profile = () => {
  const { user } = useSelector(state => state.auth);
  const [showFullAvatar, setShowFullAvatar] = useState(false);
  return (
    <div className="flex flex-col bg-slate-700 min-h-[calc(100vh-120px)]">
      
      {/* Cover Image Section */}
      <div className="relative mt-25 h-64 w-full bg-gray-300">
        {user?.coverPhoto ? (
          <img 
            src={user.coverPhoto} 
            alt="Cover" 
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
        )}
        
        {/* Profile Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
          <div className="flex items-end space-x-4">
            <div className="relative group">
              <img 
                src={user?.avatar || '/default-avatar.png'} 
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-white cursor-pointer object-cover"
                onClick={() => setShowFullAvatar(true)}
              />
              <span className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                View
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{user?.username || 'Username'}</h1>
              <p className="text-white/80">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow pt-8">
        <div className="container mx-auto px-4">
          <div className="p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Account Information</h2>
            <div className="mb-4">
              <p><strong>Name:</strong> {user?.name || 'User Name'}</p>
              <p><strong>Email:</strong> {user?.email || 'user@example.com'}</p>
            </div>
          </div>
        </div>
      </main>

      {/* Full Avatar Modal */}
      {showFullAvatar && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowFullAvatar(false)}
        >
          <img 
            src={user?.avatar || '/default-avatar.png'} 
            alt="Profile" 
            className="max-w-full max-h-full rounded-lg object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default Profile;