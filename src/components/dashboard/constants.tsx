import { routes } from '@/static-data/routes';
import { Home, Users } from 'lucide-react';

export const sidebarItems = [
  {
    title: 'Home',
    url: routes.HOME,
    icon: Home,
  },
  {
    title: 'Users',
    url: routes.USERS,
    icon: Users,
  },
];

const topmenuitems = [
  {
    name: 'Organization 1',
    url: '#',
  },
  {
    name: 'Organization 2',
    url: '#',
  },
  { name: 'Organization 3', url: '#' },
];

export const topMenu = {
  title: 'Select Organization',
  items: topmenuitems,
};
