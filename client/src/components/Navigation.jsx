// src/components/Navigation.js
import DashboardIcon from '@mui/icons-material/Dashboard';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import InventoryIcon from '@mui/icons-material/Inventory';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import EditNoteIcon from '@mui/icons-material/EditNote';
import PreviewIcon from '@mui/icons-material/Preview';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import WarehouseRoundedIcon from '@mui/icons-material/WarehouseRounded';
import MopedRoundedIcon from '@mui/icons-material/MopedRounded';
import CategoryIcon from '@mui/icons-material/Category';
import LayersIcon from '@mui/icons-material/Layers';

const NAVIGATION = [
  { segment: 'dashboard', title: 'Dashboard', icon: <DashboardIcon /> },
  { segment: 'orders', title: 'Bill Entry', icon: <PointOfSaleIcon /> },
  { segment: 'billreturn', title: 'Bill Return', icon: <ProductionQuantityLimitsIcon /> },
  {
    segment: 'reports',
    title: 'Reports',
    icon: <BarChartIcon />,
    children: [
      { segment: 'bill', title: 'Billing', icon: <DescriptionIcon /> },
      { segment: 'billreturn', title: 'Bill Return', icon: <DescriptionIcon /> },
      { segment: 'labour', title: 'Labour', icon: <DescriptionIcon /> },
    ],
  },
  { kind: 'divider' },
  {
    segment: 'stock',
    title: 'Stock',
    icon: <InventoryIcon />,
    children: [
      { segment: 'add', title: 'Add Stock', icon: <AddShoppingCartIcon /> },
      { segment: 'edit', title: 'Edit Stock', icon: <EditNoteIcon /> },
      { segment: 'view', title: 'View Stock', icon: <PreviewIcon /> },
    ],
  },
  {
    segment: 'vehicle',
    title: 'Vehicle',
    icon: <TwoWheelerIcon />,
    children: [
      { segment: 'make', title: 'Make', icon: <WarehouseRoundedIcon /> },
      { segment: 'model', title: 'Model', icon: <MopedRoundedIcon /> },
    ],
  },
  { segment: 'category', title: 'Category', icon: <CategoryIcon /> },
  { segment: 'item', title: 'Item', icon: <LayersIcon /> },
];

export default NAVIGATION;
