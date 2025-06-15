// components/DashboardLayout.jsx
import { AppProvider, DashboardLayout as ToolpadLayout, PageContainer } from '@toolpad/core';
import NAVIGATION from './Navigation';
import { AppBar, Toolbar, Typography ,Box} from '@mui/material';
import { createTheme } from '@mui/material/styles';

const demoTheme = createTheme({
  palette: {
    mode: 'light',
    background: { default: 'light', paper: '#ffffff' },
  },
});

export default function DashboardLayout({ children }) {
  return (
    <AppProvider navigation={NAVIGATION} theme={demoTheme}>
      <ToolpadLayout
        appBarContent={
          <AppBar position="static" elevation={0} sx={{ backgroundColor: 'white', boxShadow: 'none' }}>
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
      >
        <PageContainer title="">{children}</PageContainer>
      </ToolpadLayout>
    </AppProvider>
  );
}
