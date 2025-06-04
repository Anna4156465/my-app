import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import { createTheme } from '@mui/material/styles';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { DemoProvider, useDemoRouter } from '@toolpad/core/internal';
import GroupIcon from '@mui/icons-material/Group';
import PetsIcon from '@mui/icons-material/Pets';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

// Import pages
import Users from './pages/Users';
import Pets from './pages/Pets';
import Appointments from './pages/Appointments';


const NAVIGATION = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'users',
    title: 'Empleados',
    icon: <GroupIcon />,
  },
  {
    segment: 'pets',
    title: 'Mascotas',
    icon: <PetsIcon />,
  },
  {
    segment: 'appointments',
    title: 'Citas',
    icon: <CalendarMonthIcon />,
  },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function getPageComponent(pathname) {
  const path = pathname.slice(1); // Remove leading slash
  switch (path) {
    case 'users':
      return <Users />;
    case 'pets':
      return <Pets />;
    case 'appointments':
      return <Appointments />;
    default:
      return <Users />;
  }
}

function DashboardLayoutBasic(props) {
  const { window } = props;
  const router = useDemoRouter('/dashboard');
  const demoWindow = window !== undefined ? window() : undefined;

  return (
    <DemoProvider window={demoWindow}>
      <AppProvider
        navigation={NAVIGATION}
        router={router}
        theme={demoTheme}
        window={demoWindow}
      >
        <DashboardLayout>
          <Box sx={{ flexGrow: 1 }}>
            {getPageComponent(router.pathname)}
          </Box>
        </DashboardLayout>
      </AppProvider>
    </DemoProvider>
  );
}

DashboardLayoutBasic.propTypes = {
  window: PropTypes.func,
};

export default DashboardLayoutBasic;