'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import ApartmentIcon from '@mui/icons-material/Apartment';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupsIcon from '@mui/icons-material/Groups';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: <DashboardIcon /> },
  { label: 'Properties', href: '/properties', icon: <ApartmentIcon /> },
  { label: 'Tenants', href: '/tenants', icon: <GroupsIcon /> },
  { label: 'Agreements', href: '/agreements', icon: <AssignmentIcon /> },
  { label: 'Statements', href: '/statements', icon: <ReceiptLongIcon /> },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <List sx={{ px: 1 }}>
      {navItems.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link key={item.href} href={item.href}>
            <ListItemButton
              selected={isActive}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'inherit',
                  },
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </Link>
        );
      })}
    </List>
  );
}
