import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { User } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Profile
        </h2>
      </div>
      
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6">
        <div className="flex items-center space-x-6 mb-6">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={`${user.firstName} ${user.lastName}`}
              className="h-24 w-24 rounded-full"
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl">
              <User className="h-12 w-12" />
            </div>
          )}
          <div>
            <h3 className="text-2xl font-semibold text-gray-900">
              {user?.firstName} {user?.lastName}
            </h3>
            <p className="text-gray-500">{user?.email}</p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <dl className="divide-y divide-gray-100">
            <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Full name</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {user?.firstName} {user?.lastName}
              </dd>
            </div>
            <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Email address</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {user?.email}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;