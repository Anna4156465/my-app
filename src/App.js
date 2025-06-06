//React, toolpad  & MUI imports:
import { DemoProvider, useDemoRouter } from '@toolpad/core/internal';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { AppProvider } from '@toolpad/core/AppProvider';
import { createTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import { useContext } from 'react';

//Import the context for the global variables:
import UserContext from './index';

//MUI icons imports:
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SettingsIcon from '@mui/icons-material/Settings';
import GroupIcon from '@mui/icons-material/Group';
import PetsIcon from '@mui/icons-material/Pets';

//Import pages
import Users from './pages/Users';
import Pets from './pages/Pets';
import Appointments from './pages/Appointments';
import Customers from './pages/Customers';

//Theme & styles:
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

function DashboardLayoutBasic(props) {
  const { window } = props;
  const { rol } = useContext(UserContext);
  const router = useDemoRouter('/dashboard');
  const demoWindow = window !== undefined ? window() : undefined;

  //List of tabs:
  const NAVIGATION = [
    {
      kind: 'header',
      title: 'Main items',
    },
    {
      segment: 'customers',
      title: 'Clientes',
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

  //Add only admin tabs:
  if (rol === "admin") {
    NAVIGATION.push({
      segment: 'users',
      title: 'Empleados',
      icon: <SettingsIcon />,
    })
  }

  //Connect the pages to the tabs:
  function getPageComponent(pathname) {
    const path = pathname.slice(1);
    switch (path) {
      case 'users':
        return <Users />;
      case 'customers':
        return <Customers />;
      case 'pets':
        return <Pets />;
      case 'appointments':
        return <Appointments />;
    }
  }

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

export default DashboardLayoutBasic;