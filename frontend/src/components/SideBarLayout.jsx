import React, { useState } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Collapse,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  ExpandLess,
  ExpandMore,
  ListAlt as OrdersIcon,
  Report as ReportIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const drawerWidth = 240;

const menuItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  {
    label: 'Billing',
    icon: <OrdersIcon />,
    children: [
      { label: 'Bill Entry', path: '/bill' },
      { label: 'Bill Return', path: '/billreturn' },
    ],
  },
  {
    label: 'Stock',
    icon: <InventoryIcon />,
    children: [
      { label: 'Add Stock', path: '/stock/add' },
      { label: 'Edit Stock', path: '/stock/edit' },
      { label: 'View Stock', path: '/stock/view' },
    ],
  },
  {
    label: 'Reports',
    icon: <ReportIcon />,
    children: [
      { label: 'Bill Report', path: '/reports/bill' },
      { label: 'Bill Return Report', path: '/reports/billreturn' },
      { label: 'Labour Report', path: '/reports/labour' },
    ],
  },
  { label: 'Vehicle Make', icon: <DashboardIcon />, path: '/vehicle/make' },
  { label: 'Vehicle Model', icon: <DashboardIcon />, path: '/vehicle/model' },
  { label: 'Category', icon: <DashboardIcon />, path: '/category' },
  { label: 'Item', icon: <DashboardIcon />, path: '/item' },
];

export default function SidebarLayout() {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [openMenus, setOpenMenus] = useState({});
  const navigate = useNavigate();
  const { logout } = useAuth();

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  const handleMenuToggle = (label) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };
  const handleNavigation = (path) => navigate(path);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'white',
          color: '#1976d2',
          boxShadow: 'none',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box display="flex" alignItems="center">
            <IconButton onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 'bold', ml: 1 }}>
              BillingApp
            </Typography>
          </Box>
          <Button
            variant="outlined"
            color="error"
            onClick={logout}
            startIcon={<LogoutIcon />}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerOpen ? drawerWidth : 64,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerOpen ? drawerWidth : 64,
            boxSizing: 'border-box',
            transition: 'width 0.3s',
            overflowX: 'hidden',
            backgroundColor: '#f9f9f9',
          },
        }}
      >
        <Toolbar />
        <Divider />
        <List>
          {menuItems.map((item) => (
            <React.Fragment key={item.label}>
              <ListItemButton
                onClick={
                  item.children
                    ? () => handleMenuToggle(item.label)
                    : () => handleNavigation(item.path)
                }
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                {drawerOpen && <ListItemText primary={item.label} />}
                {drawerOpen && item.children && (
                  openMenus[item.label] ? <ExpandLess /> : <ExpandMore />
                )}
              </ListItemButton>

              {item.children && (
                <Collapse
                  in={openMenus[item.label]}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {item.children.map((child) => (
                      <ListItemButton
                        key={child.label}
                        sx={{ pl: 4 }}
                        onClick={() => handleNavigation(child.path)}
                      >
                        {drawerOpen && <ListItemText primary={child.label} />}
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
