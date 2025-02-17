import { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { 
  Bell, 
  User, 
  LogOut, 
  ChevronDown, 
  ChevronUp, 
  Menu,
  X
} from 'lucide-react';
import { ConfirmDialog } from '@/components/common';
import { logout as logoutAction } from '@/store/store';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { sidebarConfig } from '@/components/sidebar/metadata/sidebarShema';

// Header Component
export const Header = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      await dispatch(logoutAction()).unwrap();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setShowLogoutDialog(false);
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-white border-b">
      <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <h1 className="text-lg font-medium text-gray-900">
          Welcome {user?.firstName || user?.email}
        </h1>
        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-400 hover:text-gray-500">
            <Bell className="h-6 w-6" />
          </button>
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 p-2 text-gray-400 hover:text-gray-500"
            >
              <User className="h-6 w-6" />
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  <button
                    onClick={() => setShowLogoutDialog(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ConfirmDialog
        isOpen={showLogoutDialog}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        confirmLabel="Logout"
        cancelLabel="Cancel"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutDialog(false)}
        confirmButtonClass="bg-red-600 hover:bg-red-500"
      />
    </header>
  );
};

// Sidebar Component
export const Sidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [expandedSubSection, setExpandedSubSection] = useState<string | null>(null); // Changed to single string

  const isActive = (path: string) => pathname === path;
  const isSubSectionExpanded = (title: string) => expandedSubSection === title;

  const toggleSubSection = (title: string) => {
    setExpandedSubSection(prev => prev === title ? null : title); // Toggle between null and title
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-gray-500 hover:text-gray-600"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar for desktop */}
      <div className={`
        lg:flex flex-col w-64 border-r bg-white
        ${isMobileMenuOpen ? 'fixed inset-y-0 left-0 z-50' : 'hidden'}
      `}>
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <img className="h-8 w-auto" src="/logo.svg" alt="Your Company" />
          </div>

          {/* Horizontal Icons */}
          <div className="flex justify-around px-2 py-4 border-b">
            {sidebarConfig.sections.slice(1).map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  setActiveSection(section.id);
                  setExpandedSubSection(null); // Reset expanded section when changing sections
                }}
                className={`
                  p-2 rounded-md
                  ${activeSection === section.id
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                `}
              >
                <section.menuItem.icon className="h-6 w-6" />
              </button>
            ))}
          </div>

          {/* Vertical Sub-sections */}
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {sidebarConfig.sections.map((section) => (
              section.id === activeSection && section.sidebarItems.length > 0 && (
                <div key={section.id} className="space-y-1">
                  {section.sidebarItems.map((item) => (
                    <div key={item.title}>
                      <button
                        onClick={() => toggleSubSection(item.title)}
                        className="flex items-center justify-between w-full px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
                      >
                        <div className="flex items-center">
                          <item.icon className="mr-3 h-5 w-5" />
                          <span>{item.title}</span>
                        </div>
                        <ChevronDown 
                          className={`h-5 w-5 transform transition-transform duration-200 ${
                            isSubSectionExpanded(item.title) ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isSubSectionExpanded(item.title) && (
                        <div className="mt-1 ml-7 space-y-1">
                          {item.subItems.map((subItem) => (
                            <button
                              key={subItem.path}
                              onClick={() => {
                                navigate(subItem.path);
                                setIsMobileMenuOpen(false);
                              }}
                              className={`
                                w-full px-2 py-2 text-sm text-left
                                ${isActive(subItem.path)
                                  ? 'text-gray-900 bg-gray-100'
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                                rounded-md
                              `}
                            >
                              {subItem.title}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

// DashboardLayout Component
export const DashboardLayout = () => {
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

export default DashboardLayout;