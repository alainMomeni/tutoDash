import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/sidebar/sidebar';
import Header from '@/components/header/header';

const Dashboard = () => {
  return (
    <div className="fixed inset-0 flex bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;