// src/components/header/profileDropdown.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { logout } from '@/store/actions/authActions';
import { RootState } from '@/store/store';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useSelector } from 'react-redux';
import { Dialog } from './dialog';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogoutClick = () => {
    setIsOpen(false);
    setShowLogoutDialog(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      const result = await dispatch(logout()).unwrap();
      if (result.success) {
        navigate('/');
      }
    } catch (error) {
      console.error('❌ Logout failed:', error);
    } finally {
      setShowLogoutDialog(false);
    }
  };

  const handleProfileClick = () => {
    setIsOpen(false);
    navigate('/dashboard/profile');
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full bg-gray-200 p-1 hover:bg-gray-300 focus:outline-none"
        >
          {user?.avatar ? (
            <img
              className="h-8 w-8 rounded-full"
              src={user.avatar}
              alt={`${user.firstName} ${user.lastName}`}
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
              {user?.firstName?.[0] || user?.email[0].toUpperCase()}
            </div>
          )}
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1">
              <button
                onClick={handleProfileClick}
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </button>
              <button
                onClick={handleLogoutClick}
                className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>

      <Dialog
        isOpen={showLogoutDialog}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        confirmLabel="Logout"
        cancelLabel="Cancel"
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutDialog(false)}
      />
    </>
  );
};

export default ProfileDropdown;