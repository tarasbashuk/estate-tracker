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
import TaskAltIcon from '@mui/icons-material/TaskAlt';

import { dictionary, type Locale } from '@/lib/i18n';

const navItems = [
  { labelKey: 'dashboard', href: '/dashboard', icon: <DashboardIcon /> },
  { labelKey: 'properties', href: '/properties', icon: <ApartmentIcon /> },
  { labelKey: 'tenants', href: '/tenants', icon: <GroupsIcon /> },
  { labelKey: 'agreements', href: '/agreements', icon: <AssignmentIcon /> },
  { labelKey: 'statements', href: '/statements', icon: <ReceiptLongIcon /> },
  { labelKey: 'reminders', href: '/reminders', icon: <TaskAltIcon /> },
] as const;

export function DashboardNav({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const labels = dictionary[locale].nav;

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
              <ListItemText primary={labels[item.labelKey]} />
            </ListItemButton>
          </Link>
        );
      })}
    </List>
  );
}
