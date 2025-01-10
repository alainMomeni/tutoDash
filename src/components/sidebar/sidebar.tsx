import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { sidebarConfig } from './metadata/sidebarShema';
import { LucideIcon } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const currentSection = sidebarConfig.sections.find(
    section => section.id === activeSection
  );

  const DashboardIcon = sidebarConfig.sections[0].menuItem.icon;

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-white">
      {/* Menu Items */}
      <div className="px-2 py-4 border-b">
        <nav className="flex flex-col space-y-2">
          {/* Dashboard - Non-clickable */}
          <div className="flex items-center px-3 py-2 text-gray-700">
            <DashboardIcon className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">
              {sidebarConfig.sections[0].menuItem.title}
            </span>
          </div>

          {/* Horizontal section buttons */}
          <div className="flex justify-start space-x-2 px-2">
            {sidebarConfig.sections.slice(1).map(({ menuItem }) => {
              const Icon: LucideIcon = menuItem.icon;
              const isActive = activeSection === menuItem.id;
              
              return (
                <button
                  key={menuItem.id}
                  onClick={() => setActiveSection(isActive ? null : menuItem.id)}
                  title={menuItem.title}
                  className={`
                    p-2 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-gray-100 text-gray-900' 
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Sidebar Items */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {currentSection?.sidebarItems.map((item, index) => {
            const Icon: LucideIcon = item.icon;
            const isExpanded = expandedItem === `${activeSection}-${index}`;

            return (
              <div key={`${activeSection}-${index}`}>
                <button
                  onClick={() => setExpandedItem(
                    isExpanded ? null : `${activeSection}-${index}`
                  )}
                  className={`
                    flex w-full items-center justify-between px-4 py-3
                    text-sm font-medium rounded-lg transition-colors
                    ${isExpanded
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="flex items-center">
                    <Icon className="h-5 w-5 mr-2" />
                    <span>{item.title}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>

                {isExpanded && (
                  <div className="mt-1 space-y-1 px-2">
                    {item.subItems.map((subItem) => (
                      <button
                        key={subItem.path}
                        onClick={() => navigate(subItem.path)}
                        className={`
                          flex w-full items-center px-4 py-2 text-sm
                          rounded-md transition-colors
                          ${pathname === subItem.path
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                          }
                        `}
                      >
                        <span>{subItem.title}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;