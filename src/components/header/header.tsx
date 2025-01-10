import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import NotificationDropdown from './notificationDropdown';
import ProfileDropdown from './profileDropdown';

const Header = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <header className="sticky top-0 z-10 bg-white border-b">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <h1 className="text-lg font-medium text-gray-900">
            Welcome {user?.firstName || user?.email}
          </h1>
          <div className="flex items-center gap-4">
            <NotificationDropdown />
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;