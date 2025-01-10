import { Outlet } from 'react-router-dom';

const LoginPage = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please enter your details to continue
          </p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;