import {
  LayoutDashboard,
  DollarSign,
  FileText,
  Package,
  Settings,
  ShoppingCart
} from 'lucide-react';
import { SidebarConfig } from '@/types/sidebar/sidebarType';

export const sidebarConfig: SidebarConfig = {
  sections: [
    {
      id: 'dashboard',
      menuItem: {
        id: 'dashboard',
        title: 'Dashboard',
        icon: LayoutDashboard,
        targetSectionId: 'dashboard'
      },
      sidebarItems: []
    },
    {
      id: 'sales',
      menuItem: {
        id: 'sales',
        title: '',
        icon: DollarSign,
        targetSectionId: 'sales'
      },
      sidebarItems: [
        {
          icon: Package,
          title: 'Approvisionnement',
          subItems: [
            { title: 'Produits', path: '/dashboard/product' }
          ]
        },
        {
          icon: ShoppingCart,
          title: 'Sales Management',
          subItems: [
            { title: 'Sales', path: '/dashboard/sales' }
          ]
        }
      ]
    },
    {
      id: 'reports',
      menuItem: {
        id: 'reports',
        title: '',
        icon: FileText,
        targetSectionId: 'reports'
      },
      sidebarItems: []
    },
    {
      id: 'settings',
      menuItem: {
        id: 'settings',
        title: '',
        icon: Settings,
        targetSectionId: 'settings'
      },
      sidebarItems: []
    }
  ]
};