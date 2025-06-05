//React & MUI imports:
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Grid,
  IconButton
} from "@mui/material";

//MUI icons imports:
import AddIcon from '@mui/icons-material/Add';

//Pop-up style:
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function Users() {
  //Data obtained from the API:
  const [data, setData] = useState([]);

  //Data for the new user (crate user):
  const [dni, setDni] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [surnames, setSurname] = React.useState("");
  const [name, setName] = React.useState("");
  const [rol, setRol] = React.useState("");
  const [mail, setMail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [date, setDate] = React.useState("");

  //Trigger for the create user pop-up:
  const [open, setOpen] = React.useState(false);

  //Columns of the table:
  const COLUMNS = [
    { id: 'dni', label: 'DNI', minWidth: 100 },
    { id: 'name', label: 'Nombre', minWidth: 100, },
    { id: 'surnames', label: 'Apellido', minWidth: 100, },
    { id: 'rol', label: 'Rol', minWidth: 100 },
    { id: 'mail', label: 'Mail', minWidth: 100 },
    { id: 'phone', label: 'Phone', minWidth: 100 },
  ];

  //Do this when the page load:
  useEffect(() => {
    getUsers();
  }, []);

  //Handle functions for the pop-up:
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  async function getUsers() {
    try {
      const response = await fetch('http://localhost:5001/api/v1/users', {
        method: 'GET',
        credentials: 'include'
      });
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error al obtener datos de la API:', error);
    }
  }

  async function createUser() {
    //Prepare body to send:
    const DATA = {
      dni: dni,
      name: name,
      password: password,
      surnames: surnames,
      rol: rol,
      mail: mail,
      phone: phone,
      admission_date: date
    };
    console.log("eyy", DATA);


    try {
      const response = await fetch('http://localhost:5001/api/v1/users/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        mode: 'cors',
        body: JSON.stringify(DATA)
      });
      //Save data:
      console.log("eeyy", response);
    } catch (error) { console.error('Error al obtener datos de la API:', error); }
  }

  return (
    <Box sx={{ p: 4 }}>
      {/*Header*/}
      <Grid container spacing={2} alignItems="center">
        <Grid item sx={{ marginTop: "10px" }}>
          <Typography variant="h4" gutterBottom>
            Empleados
          </Typography>
        </Grid>
        <Grid item>
          <IconButton size="large" onClick={handleOpen}>
            <AddIcon fontSize="inherit" />
          </IconButton>
        </Grid>
      </Grid>

      {/*Table*/}
      <Table stickyHeader>
        <TableHead>
          {COLUMNS.map((column) => (
            <TableCell
              key={column.id}
              align={column.align}
              style={{ top: 57, minWidth: column.minWidth }}
            >
              {column.label}
            </TableCell>
          ))}
        </TableHead>
        <TableBody>
          {data.length > 0 && data.map((row) => {
            return (
              <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                {COLUMNS?.map((column) => {
                  const value = row[column.id];
                  return (
                    <TableCell key={column.id} align={column.align}>
                      {column.format && typeof value === 'number'
                        ? column.format(value)
                        : value}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/*Pop-up*/}
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          {/*Title*/}
          <Typography variant="h6" sx={{ marginBottom: "10px" }}>Create user</Typography>
          {/*Inputs*/}
          <Grid container spacing={1}>
            <Grid item size={6}>
              <TextField
                label="DNI"
                value={dni}
                size="small"
                onChange={(e) => setDni(e.target.value)}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                label="Contraseña"
                value={password}
                size="small"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                label="Nombre"
                value={name}
                size="small"
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                label="Apellido"
                value={surnames}
                size="small"
                onChange={(e) => setSurname(e.target.value)}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                label="Rol"
                value={rol}
                size="small"
                onChange={(e) => setRol(e.target.value)}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                label="Teléfono"
                value={phone}
                size="small"
                onChange={(e) => setPhone(e.target.value)}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                label="Correo"
                value={mail}
                size="small"
                onChange={(e) => setMail(e.target.value)}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                label="Date"
                value={date}
                size="small"
                type="date"
                onChange={(e) => setDate(e.target.value)}
              />
            </Grid>
          </Grid>
          {/*Buttons*/}
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Grid container spacing={2}>
              <Grid item>
                <Button onClick={handleClose} variant="contained" color="error">
                  Cerrar
                </Button>
              </Grid>
              <Grid item>
                <Button onClick={createUser} variant="contained">
                  Crear
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}