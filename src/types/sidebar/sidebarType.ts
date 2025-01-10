import { LucideIcon } from 'lucide-react';

export type MenuItem = {
  id: string;
  title: string;
  icon: LucideIcon;
  targetSectionId: string;
};

export type SubItem = {
  title: string;
  path: string;
  type?: string;
};

export type SidebarItem = {
  icon: LucideIcon;
  title: string;
  subItems: SubItem[];
};

export type Section = {
  id: string;
  menuItem: MenuItem;
  sidebarItems: SidebarItem[];
};

export type SidebarConfig = {
  sections: Section[];
};