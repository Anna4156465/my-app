//React & MUI imports:
import React, { useState, useEffect } from 'react';
import { Box, Button, Divider, Grid, Modal, Typography, } from "@mui/material";

//Calendar imports:
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'

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
  //Localizer for the calendar:
  require('moment/locale/es.js');
  const localizer = momentLocalizer(moment)

  //Data obtained from the API:
  const [data, setData] = useState([]);

  //Trigger for the more info pop-up:
  const [open, setOpen] = React.useState(false);

  //Do this when the page load:
  useEffect(() => {
    getAppointments();
  }, []);

  async function getAppointments() {
    try {
      //Do the call:
      const response = await fetch('http://localhost:5001/api/v1/appointments', {
        method: 'GET',
        credentials: 'include'
      });
      //Save data:
      const jsonData = await response.json();
      const formatedData = jsonData.map((item) => {
        const startDate = new Date(item.date);
        return {
          title: item.type,
          description: item.description,
          pet: item.pet_id,
          vet: item.user_id,
          start: new Date(item.date),
          end: new Date(startDate.getTime() + 2 * 60 * 60 * 1000)
        };
      });
      setData(formatedData);
    } catch (error) {
      console.error('Error al obtener datos de la API:', error);
    }
  }

  //When an appointment is clicked, do:
  function handleSelectEvent(event) {
    setOpen({ open: true, event: event });
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Calendario
      </Typography>
      <div style={{ height: "800px" }}>
        <Calendar
          localizer={localizer}
          events={data}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          messages={{
            next: "Sig",
            previous: "Ant",
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día"
          }}
          onSelectEvent={handleSelectEvent}
        />
      </div>

      {/*Pop-up*/}
      <Modal open={open.open} onClose={() => setOpen({ open: false })}>
        <Box sx={style}>
          {/*Title*/}
          <Typography variant="h6" >{open.event?.title}</Typography>
          <Typography variant='body' >{open.event?.description}</Typography>
          <Divider sx={{ marginBottom: "10px" }} />
          <Grid container >
            <Grid item size={12}>
            </Grid>
            <Grid item size={12}>
              <Typography variant='body' sx={{ fontWeight: 'bold' }}>Mascota: </Typography>
              <Typography variant='body'>{open.event?.pet}</Typography>
            </Grid>
            <Grid item size={12}>
              <Typography variant='body' sx={{ fontWeight: 'bold' }}>Veterniario asignado: </Typography>
              <Typography variant='body'>{open.event?.vet}</Typography>
            </Grid>
          </Grid>
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Grid container spacing={2}>
              <Grid item>
                <Button onClick={() => setOpen({ open: false })} variant="contained" color="error">
                  Cerrar
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Modal>
    </Box>
  );

}