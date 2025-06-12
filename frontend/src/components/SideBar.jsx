import * as React from 'react';
import { createTheme, styled } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Box, Typography } from "@mui/material";
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import { useEffect } from 'react';
import BillingScreen from '../pages/BillingPage'
import VehicleMake from '../pages/VehicleMake';
import VehicleModel from '../pages/Vehiclemodel';
import CategoryScreen from '../pages/CategoryScreen';
import ItemScreen from '../pages/ItemScreen';
import BillReport from '../pages/BillReports';
import StockEntry from '../pages/StockEntry';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import InventoryIcon from '@mui/icons-material/Inventory';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import EditNoteIcon from '@mui/icons-material/EditNote';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import CategoryIcon from '@mui/icons-material/Category';
import StockEdit from '../pages/StockEdit';
import WarehouseRoundedIcon from '@mui/icons-material/WarehouseRounded';
import MopedRoundedIcon from '@mui/icons-material/MopedRounded';
import LabourReport from '../pages/LabourReport';
import Dashboard from '../pages/DashBoard';
import { AppBar, Toolbar } from '@mui/material';

const NAVIGATION = [

  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'orders',
    title: 'Billing',
    icon: <PointOfSaleIcon />,
  },
  {
    segment: 'reports',
    title: 'Reports',
    icon: <BarChartIcon />,
    children: [
      {
        segment: 'bill',
        title: 'Billing',
        icon: <DescriptionIcon />,
      },
      {
        segment: 'labour',
        title: 'Labour',
        icon: <DescriptionIcon />,
      },
    ],
  },
  {
    kind: 'divider',
  },
  {
    segment: 'stock',
    title: 'Stock',
    icon: <InventoryIcon />,
    children: [
      {
        segment: 'add',
        title: 'Add Stock',
        icon: <AddShoppingCartIcon />,
      },
      {
        segment: 'edit',
        title: 'Edit Stock',
        icon: <EditNoteIcon />,
      },
    ],
  },
  {
    segment: 'vehicle',
    title: 'Vehicle',
    icon: <TwoWheelerIcon />,
    children: [
      {
        segment: 'make',
        title: 'Make',
        icon: <WarehouseRoundedIcon />,
      },
      {
        segment: 'model',
        title: 'Model',
        icon: <MopedRoundedIcon />,
      },
    ],
  },
  {
    segment: 'category',
    title: 'Category',
    icon: <CategoryIcon />,
  },
  {
    segment: 'item',
    title: 'Item',
    icon: <LayersIcon />,
  },
];

const demoTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: 'light', // light grey page background
      paper: '#ffffff',   // white for cards/paper
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});




function useDemoRouter(initialPath) {
  const [pathname, setPathname] = React.useState(initialPath);
  useEffect(() => {
    const titleElement = document.querySelector(
      'header .MuiStack-root.css-m69qwo-MuiStack-root > a > div > h6'
    );
    if (titleElement) {
      titleElement.innerText = 'BillingApp'; // 👈 Your custom name here
    }
  }, []);

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  return router;
}

function renderPage(pathname) {
  switch (pathname) {
    case '/dashboard':
      return <Dashboard />;
    case '/orders':
      return <BillingScreen />;
    case '/vehicle/make':
      return <VehicleMake />;
    case '/vehicle/model':
      return <VehicleModel />;
    case '/category':
      return <CategoryScreen />;
    case '/item':
      return <ItemScreen />;
    case '/reports/bill':
      return <BillReport />;
    case '/reports/labour':
      return <LabourReport />;
    case '/stock/add':
      return <StockEntry />;
    case '/stock/edit':
      return <StockEdit />;
    default:
      return <div>Page not found</div>;
  }
}


export default function SideBar(props) {
  const { window } = props;

  const router = useDemoRouter('/dashboard');

  // Remove this const when copying and pasting into your project.
  const demoWindow = window ? window() : undefined;

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout
        appBarContent={
          <AppBar
            position="static"
            elevation={0}
            sx={{ backgroundColor: 'white', boxShadow: 'none' }}
          >
            <Toolbar variant="dense" sx={{ justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', pl: 1 }}>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ fontWeight: 'bold', color: '#1976d2' }}
                >
                  BillingApp
                </Typography>
              </Box>
            </Toolbar>
          </AppBar>
        }
        appBarActions={<></>}
      >
        <PageContainer title="">
          {renderPage(router.pathname)}
        </PageContainer>
      </DashboardLayout>


    </AppProvider>
  );
}