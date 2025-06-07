//React, toolpad  & MUI imports:
import { DemoProvider, useDemoRouter } from '@toolpad/core/internal';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { AppProvider } from '@toolpad/core/AppProvider';
import { createTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { useContext, useEffect } from 'react';

//Import the context for the global variables:
import UserContext from './index';

//MUI icons imports:
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import GroupIcon from '@mui/icons-material/Group';
import PetsIcon from '@mui/icons-material/Pets';

//Import pages
import Users from './pages/Users';
import Pets from './pages/Pets';
import Appointments from './pages/Appointments';
import Customers from './pages/Customers';
import Calendar from './pages/Calendar';

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
  const navigate = useNavigate();

  const { window } = props;
  const { rol } = useContext(UserContext);
  const router = useDemoRouter('/dashboard');
  const demoWindow = window !== undefined ? window() : undefined;

  //Add the name app and the logo:
  useEffect(() => {
    const el = document.querySelector('.toolpad-demo-app-1t2rogw-MuiTypography-root');
    if (el) el.textContent = 'Veterinarios App';

    const s = document.querySelector('.toolpad-demo-app-9z93tp');
    if (s) {
      s.textContent = '';
      const img = document.createElement('img');
      img.src = '/VetApi-logo-SinFondo.png';
      img.width = 40;
      img.height = 40;
      s.appendChild(img);
    }
  }, []);

  async function logout() {
    try {
      //Do the call:
      const response = await fetch('http://localhost:5001/api/v1/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
        credentials: "include",
      });
      if (response.status === 200) {
        navigate('/');
      }
    } catch (error) { console.error('Error al obtener datos de la API:', error); }
  }

  //List of tabs:
  const NAVIGATION = [
    {
      segment: 'calendar',
      title: 'Calendario',
      icon: <CalendarMonthIcon />,
    },
    {
      segment: 'appointments',
      title: 'Citas',
      icon: <ScheduleIcon />,
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
  ];

  //Add only admin tabs:
  if (rol === "admin") {
    NAVIGATION.push({
      segment: 'users',
      title: 'Empleados',
      icon: <SettingsIcon />,
    })
  }

  NAVIGATION.push({
    icon: <Button
      startIcon={<LogoutIcon color="primary" />}
      sx={{ width: '280px' }}
      onClick={logout}
    >
      Cerrar
    </Button>
  })


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
      case 'calendar':
        return <Calendar />;
    }

  }

  return (
    rol !== "" ? (
      <DemoProvider window={demoWindow} >
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
    ) :
      (
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.default'
          }}
        >
          <Card sx={{ maxWidth: 400, width: '100%', mx: 2 }}>
            <CardContent sx={{ p: 4 }}>
              {/*Title*/}
              <Typography variant="h4" component="h1" gutterBottom align="center">
                Ha habido un error
              </Typography>
              <Button
                onClick={() => navigate('/')}
                fullWidth
                variant="contained"
                sx={{ mt: 3 }}
                size="large"
              >
                Volver a iniciar sesión
              </Button>
            </CardContent>
          </Card>
        </Box>
      )
  );
}

export default DashboardLayoutBasic;