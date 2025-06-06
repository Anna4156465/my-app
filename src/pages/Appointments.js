//React & MUI imports:
import Snackbar from '@mui/material/Snackbar';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Modal,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Grid,
  IconButton,
  MenuItem
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

export default function Appointments() {
  //Data obtained from the API:
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [pets, setPets] = useState([]);


  //Data for the new user (crate user):
  const [id, setId] = React.useState("");
  const [type, setType] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [date, setDate] = React.useState("");
  const [user, setUser] = React.useState("");
  const [pet, setPet] = React.useState("");

  //Trigger for the create user pop-up:
  const [open, setOpen] = React.useState(false);

  //Toggle show notification:
  const [snack, setSnack] = useState(false);

  //Columns of the table:
  const COLUMNS = [
    { id: 'id', label: 'ID', minWidth: 50 },
    { id: 'type', label: 'Tipo', minWidth: 50, },
    { id: 'description', label: 'Descripción', minWidth: 50, },
    { id: 'date', label: 'Fecha', minWidth: 50, },
    { id: 'user_id', label: 'Veterinario asignado', minWidth: 50 },
    { id: 'pet_id', label: 'Mascota a tratar', minWidth: 50 },
  ];

  //Do this when the page load:
  useEffect(() => {
    getAppointments();
    getUsers();
    getPets();
  }, []);

  //Handle functions for the pop-up:
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setId("");
    setType("");
    setDescription("");
    setUser("");
    setDate();
    setPet("");
  };

  async function getAppointments() {
    try {
      //Do the call:
      const response = await fetch('http://localhost:5001/api/v1/appointments', {
        method: 'GET',
        credentials: 'include'
      });
      //Save data:
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error al obtener datos de la API:', error);
    }
  }

  async function getUsers() {
    try {
      //Do the call:
      const response = await fetch('http://localhost:5001/api/v1/users?rol=vet', {
        method: 'GET',
        credentials: 'include'
      });
      //Save data:
      const jsonData = await response.json();
      setUsers(jsonData);
    } catch (error) {
      console.error('Error al obtener datos de la API:', error);
    }
  }

  async function getPets() {
    try {
      //Do the call:
      const response = await fetch('http://localhost:5001/api/v1/pets', {
        method: 'GET',
        credentials: 'include'
      });
      //Save data:
      const jsonData = await response.json();
      setPets(jsonData);
    } catch (error) {
      console.error('Error al obtener datos de la API:', error);
    }
  }

  async function createAppointment() {
    //Prepare body to send:
    const DATA = {
      id: id,
      type: type,
      description: description,
      date: date,
      user_id: user,
      pet_id: pet,
    };

    try {
      //Do the call:
      const response = await fetch('http://localhost:5001/api/v1/appointments/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        mode: 'cors',
        body: JSON.stringify(DATA)
      });
      //Save and upload data:
      if (response.status === 201) {
        setData([...data, DATA]);
        setSnack({ open: true, message: "Cita creada!" });
        handleClose();
      }
      else if (response.status == 409) {
        setSnack({ open: true, message: "La cita ya existe!" });
      }
    } catch (error) { console.error('Error al obtener datos de la API:', error); }
  }

  async function deleteAppointment(id) {
    try {
      //Do the call:
      const response = await fetch('http://localhost:5001/api/v1/appointments/' + parseInt(id), {
        method: 'DELETE',
        credentials: "include",
      });
      //Upload data:
      if (response.status === 200) {
        setData(data.filter((item) => item.id !== id));
        setSnack({ open: true, message: "Cita eliminada!" });
      }
      else setSnack({ open: true, message: "Ha habido un error!" });
    } catch (error) { console.error('Error al obtener datos de la API:', error); }
  }

  return (
    <Box sx={{ p: 4 }}>
      {/*Header*/}
      <Grid container spacing={2} alignItems="center">
        <Grid item sx={{ marginTop: "10px" }}>
          <Typography variant="h4" gutterBottom>
            Citas
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
          <TableCell key={999}> Acciones </TableCell>
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
                <TableCell key={999}>
                  <Button color="error" onClick={() => deleteAppointment(row.id)}> Borrar! </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/*Pop-up*/}
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          {/*Title*/}
          <Typography variant="h6" sx={{ marginBottom: "10px" }}>Crear cita</Typography>
          {/*Inputs & buttons*/}
          <form>
            <Grid container spacing={1}>
              <Grid item size={6}>
                <TextField
                  label="ID"
                  value={id}
                  size="small"
                  onChange={(e) => setId(e.target.value)}
                  required
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  label="Tipo"
                  value={type}
                  size="small"
                  onChange={(e) => setType(e.target.value)}
                  required
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  label="Descripción"
                  value={description}
                  size="small"
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  fullWidth
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  label="Date"
                  value={date}
                  size="small"
                  onChange={(e) => setDate(e.target.value)}
                  required
                  fullWidth
                  type="date"
                />
              </Grid>
              <Grid size={6}>
                Veterinario:
                <Select
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  size="small"
                  required
                  fullWidth

                >
                  {users.length > 0 && users?.map((item) => <MenuItem value={item.dni}>{item.dni}</MenuItem>)}
                </Select>
              </Grid>
              <Grid size={6}>
                Mascota:
                <Select
                  value={pet}
                  onChange={(e) => setPet(e.target.value)}
                  size="small"
                  required
                  fullWidth
                >
                  {pets.length > 0 && pets?.map((item) => <MenuItem value={item.num_chip}>{item.num_chip}</MenuItem>)}
                </Select>
              </Grid>
            </Grid>
            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
              <Grid container spacing={2}>
                <Grid item>
                  <Button onClick={handleClose} variant="contained" color="error">
                    Cerrar
                  </Button>
                </Grid>
                <Grid item>
                  <Button onClick={createAppointment} variant="contained">
                    Crear
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </form>
        </Box>
      </Modal>

      {/*Notification*/}
      <Snackbar
        open={snack.open}
        onClose={() => setSnack({ open: false })}
        autoHideDuration={6000}
        message={snack.message}
        key="top left"
      />
    </Box >
  );
}