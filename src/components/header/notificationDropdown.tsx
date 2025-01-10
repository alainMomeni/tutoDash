import { useState } from 'react';
import { Bell } from 'lucide-react';
import { Notification } from '@/types/header/headerTypes';


const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Exemple de données de notification
  const notifications: Notification[] = [
    {
      id: '1',
      title: 'Nouvelle commande',
      message: 'Commande #1234 reçue',
      time: 'Il y a 5 min',
      read: false
    },
    {
      id: '2',
      title: 'Nouveau message',
      message: 'Message de support client',
      time: 'Il y a 10 min',
      read: false
    },
    {
      id: '3',
      title: 'Alerte stock',
      message: 'Produit XYZ en rupture',
      time: 'Il y a 30 min',
      read: true
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-2">
            <div className="px-4 py-2 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {notifications.slice(0, 3).map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 hover:bg-gray-50 ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                </div>
              ))}
            </div>

            <div className="px-4 py-2 border-t border-gray-200">
              <button
                className="w-full text-center text-sm text-blue-600 hover:text-blue-800"
                onClick={() => {/* Ajouter la navigation vers la page des notifications */}}
              >
                Voir toutes les notifications
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;