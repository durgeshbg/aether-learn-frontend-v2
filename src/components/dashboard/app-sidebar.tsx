import { ChevronDown, ChevronUp, LogOut, User2 } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Link, useNavigate } from 'react-router';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
} from '../ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '../ui/button';
import { sidebarItems, topMenu } from './constants';
import { routes } from '@/static-data/routes';

const { items: topmenuitems, title: topMenuTitle } = topMenu;

export function AppSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const bottommenuitems = [
    {
      name: 'Sign out',
      icon: LogOut,
      onClick: () => logout(),
    },
    {
      name: 'Profile',
      icon: User2,
      onClick: () => {
        navigate(routes.PROFILE);
      },
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className='cursor-pointer'>
                  {topMenuTitle}
                  <ChevronDown className='ml-auto' />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-[--radix-popper-anchor-width]'>
                {topmenuitems.map((item, index) => (
                  <DropdownMenuItem className='cursor-pointer' key={index}>
                    <Link to={item.url}>
                      <span>{item.name}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className='cursor-pointer'>
                  <User2 /> {user && `${user?.firstName} ${user?.lastName}`}
                  <ChevronUp className='ml-auto' />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side='top'
                className='w-[--radix-popper-anchor-width] translate-x-12 -translate-y-2'
              >
                {bottommenuitems.map((item, index) => (
                  <DropdownMenuItem className='cursor-pointer p-0' key={index}>
                    <Button variant={'link'} onClick={item.onClick}>
                      {item.icon && <item.icon className='mr-2' />}
                      <span>{item.name}</span>
                    </Button>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
