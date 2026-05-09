import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import ApartmentIcon from '@mui/icons-material/Apartment';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupsIcon from '@mui/icons-material/Groups';

const drawerWidth = 260;

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: <DashboardIcon /> },
  { label: 'Properties', href: '/properties', icon: <ApartmentIcon /> },
  { label: 'Tenants', href: '/tenants', icon: <GroupsIcon /> },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Estate Tracker
          </Typography>
        </Toolbar>
        <Divider />
        <List sx={{ px: 1 }}>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <ListItemButton sx={{ borderRadius: 1, mb: 0.5 }}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </Link>
          ))}
        </List>
      </Drawer>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box
          component="header"
          sx={{
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <Toolbar>
            <Stack
              direction="row"
              spacing={2}
              sx={{ width: '100%', alignItems: 'center' }}
            >
              <Typography
                variant="h6"
                sx={{ display: { xs: 'block', md: 'none' }, flexGrow: 1 }}
              >
                Estate Tracker
              </Typography>
              <Box sx={{ flexGrow: { xs: 0, md: 1 } }} />
              <UserButton showName />
            </Stack>
          </Toolbar>
        </Box>

        <Box component="main" sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1280 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
