//React and MUI imports:
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Collapse,
  TextField,
  Typography
} from "@mui/material";

//Import the context for the global variables:
import UserContext from '../index';

export default function Login() {
  const navigate = useNavigate();
  const { setRol } = useContext(UserContext);

  //Data for the login:
  const [dni, setName] = React.useState('');
  const [password, setPassword] = React.useState('');

  //Data obtained from the API:
  const [data, setData] = useState(null);

  //Toggle show login error::
  const [error, setError] = useState(false);

  //When data from the login is recieved do:
  useEffect(() => {
    data === 200 && navigate('/app');
    data === 401 && setError(true);
  }, [data]);

  //Handle the sing in button:
  const handleSubmit = (e) => {
    e.preventDefault();
    postLogin();
  };

  async function postLogin() {
    //Prepare body to send:
    const DATA = {
      dni: dni,
      password: password
    };

    try {
      //Do the call:
      const response = await fetch('http://127.0.0.1:5001/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
        credentials: "include",
        body: JSON.stringify(DATA)
      });
      //Save data:
      const jsonData = await response.json();
      setData(response.status);
      setRol(jsonData.rol);
    } catch (error) { console.error('Error al obtener datos de la API:', error); }
  }

  return (
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
            Iniciar sesión
          </Typography>
          {/*Inputs, alert & button*/}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="DNI"
              margin="normal"
              value={dni}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Contraseña"
              type="password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Collapse in={error}><Alert severity="error">
              Contraseña o usuario incorrecto.
            </Alert></Collapse>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
              size="large"
            >
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}