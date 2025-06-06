//React & MUI imports:
import Snackbar from '@mui/material/Snackbar';
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

export default function Customers() {
  //Data obtained from the API:
  const [data, setData] = useState([]);

  //Data for the new customer (create customer):
  const [dni, setDni] = React.useState("");
  const [surnames, setSurname] = React.useState("");
  const [name, setName] = React.useState("");
  const [mail, setMail] = React.useState("");
  const [phone, setPhone] = React.useState("");

  //Trigger for the create customer pop-up:
  const [open, setOpen] = React.useState(false);

  //Toggle show notification:
  const [snack, setSnack] = useState(false);

  //Columns of the table:
  const COLUMNS = [
    { id: 'dni', label: 'DNI', minWidth: 50 },
    { id: 'name', label: 'Nombre', minWidth: 50, },
    { id: 'surnames', label: 'Apellido', minWidth: 50, },
    { id: 'mail', label: 'Correo', minWidth: 50 },
    { id: 'phone', label: 'Teléfono', minWidth: 50 }
  ];

  //Do this when the page load:
  useEffect(() => {
    getCustomers();
  }, []);

  //Handle functions for the pop-up:
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setDni("");
    setSurname("");
    setName("");
    setMail("");
    setPhone("");
  };

  async function getCustomers() {
    try {
      //Do the call:
      const response = await fetch('http://localhost:5001/api/v1/customers', {
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

  async function createCustomer() {
    //Prepare body to send:
    const DATA = {
      dni: dni,
      name: name,
      surnames: surnames,
      mail: mail,
      phone: phone,
    };

    try {
      //Do the call:
      const response = await fetch('http://localhost:5001/api/v1/customers/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        mode: 'cors',
        body: JSON.stringify(DATA)
      });
      //Save and upload data:
      if (response.status === 201) {
        setData([...data, DATA]);
        setSnack({ open: true, message: "Cliente creado!" });
        handleClose();
      }
      else if (response.status == 409) {
        setSnack({ open: true, message: "El cliente ya existe!" });
      }
    } catch (error) { console.error('Error al obtener datos de la API:', error); }
  }

  async function deleteCustomer(dni) {
    try {
      //Do the call:
      const response = await fetch('http://localhost:5001/api/v1/customers/' + dni, {
        method: 'DELETE',
        credentials: "include",
      });
      //Upload data:
      if (response.status === 200) {
        setData(data.filter((item) => item.dni !== dni));
        setSnack({ open: true, message: "Cliente eliminado!" });
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
            Clientes
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
                  <Button color="error" onClick={() => deleteCustomer(row.dni)}> Borrar! </Button>
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
          <Typography variant="h6" sx={{ marginBottom: "10px" }}>Crear cliente</Typography>
          {/*Inputs & buttons*/}
          <form>
            <Grid container spacing={1}>
              <Grid item size={12}>
                <TextField
                  label="DNI"
                  value={dni}
                  size="small"
                  onChange={(e) => setDni(e.target.value)}
                  required
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
                  label="Apellido"
                  value={surnames}
                  size="small"
                  onChange={(e) => setSurname(e.target.value)}
                  required
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  label="Teléfono"
                  value={phone}
                  size="small"
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  label="Correo"
                  value={mail}
                  size="small"
                  onChange={(e) => setMail(e.target.value)}
                  required
                />
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
                  <Button onClick={createCustomer} variant="contained">
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