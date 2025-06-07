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

export default function Pets() {
  //Data obtained from the API:
  const [data, setData] = useState([]);
  const [customers, setCustomers] = useState([]);

  //Data for the new pet (crate pet):
  const [chip, setChip] = React.useState("");
  const [name, setName] = React.useState("");
  const [date, setDate] = React.useState("");
  const [animal, setAnimal] = React.useState("");
  const [breed, setBreed] = React.useState("");
  const [customer, setCustomer] = React.useState("");

  //Trigger for the create pet pop-up:
  const [open, setOpen] = React.useState(false);

  //Toggle show notification:
  const [snack, setSnack] = useState(false);

  //Columns of the table:
  const COLUMNS = [
    { id: 'num_chip', label: 'Chip', minWidth: 50 },
    { id: 'name', label: 'Nombre', minWidth: 50, },
    { id: 'birth_date', label: 'Fecha de nacimiento', minWidth: 50, },
    { id: 'animal', label: 'Animal', minWidth: 50 },
    { id: 'breed', label: 'Raza', minWidth: 50 },
    { id: 'customer_id', label: 'Propietario', minWidth: 50 },
  ];

  //Do this when the page load:
  useEffect(() => {
    getPets();
    getCustomers();
  }, []);

  //Handle functions for the pop-up:
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setChip("");
    setName("");
    setDate("");
    setAnimal("");
    setBreed("");
    setCustomer("");
  };

  async function getPets() {
    try {
      //Do the call:
      const response = await fetch('http://localhost:5001/api/v1/pets', {
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

  async function getCustomers() {
    try {
      //Do the call:
      const response = await fetch('http://localhost:5001/api/v1/customers', {
        method: 'GET',
        credentials: 'include'
      });
      //Save data:
      const jsonData = await response.json();
      setCustomers(jsonData);
    } catch (error) {
      console.error('Error al obtener datos de la API:', error);
    }
  }

  async function createPet() {
    //Prepare body to send:
    const DATA = {
      num_chip: chip,
      name: name,
      birth_date: date,
      animal: animal,
      breed: breed,
      customer_id: customer,
    };

    try {
      //Do the call:
      const response = await fetch('http://localhost:5001/api/v1/pets/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        mode: 'cors',
        body: JSON.stringify(DATA)
      });
      //Save and upload data:
      if (response.status === 201) {
        setData([...data, DATA]);
        setSnack({ open: true, message: "Mascota creada!" });
        handleClose();
      }
      else if (response.status == 409) {
        setSnack({ open: true, message: "La mascota ya existe!" });
      }
    } catch (error) { console.error('Error al obtener datos de la API:', error); }
  }

  async function deletePet(chip) {
    try {
      //Do the call:
      const response = await fetch('http://localhost:5001/api/v1/pets/' + chip, {
        method: 'DELETE',
        credentials: "include",
      });
      //Upload data:
      if (response.status === 200) {
        setData(data.filter((item) => item.num_chip !== chip));
        setSnack({ open: true, message: "Mascota eliminada!" });
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
            Mascotas
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
                  <Button color="error" onClick={() => deletePet(row.num_chip)}> Borrar! </Button>
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
          <Typography variant="h6" sx={{ marginBottom: "10px" }}>Crear mascota</Typography>
          {/*Inputs & buttons*/}
          <form>
            <Grid container spacing={1}>
              <Grid item size={12}>
                <TextField
                  label="Chip"
                  value={chip}
                  size="small"
                  onChange={(e) => setChip(e.target.value)}
                  required
                  fullWidth
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  label="Nombre"
                  value={name}
                  size="small"
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  label="Animal"
                  value={animal}
                  size="small"
                  onChange={(e) => setAnimal(e.target.value)}
                  required
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  label="Raza"
                  value={breed}
                  size="small"
                  onChange={(e) => setBreed(e.target.value)}
                  required
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  label="Fecha de nacimiento"
                  value={date}
                  size="small"
                  type="date"
                  onChange={(e) => setDate(e.target.value)}
                  required
                  fullWidth
                   InputLabelProps={{
                    shrink: true, // Para que el label no se superponga al valor
                  }}
                />
              </Grid>
              <Grid size={12}>
                Propietario:
                <Select
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  fullWidth
                  size="small"
                  required
                >
                  {customers.length > 0 && customers.map((item) => <MenuItem value={item.dni}>{item.dni}</MenuItem>)}
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
                  <Button onClick={createPet} variant="contained">
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