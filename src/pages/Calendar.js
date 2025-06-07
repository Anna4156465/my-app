//React & MUI imports:
import { useState, useEffect } from 'react';
import { Box, Typography, } from "@mui/material";

//Calendar imports:
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'

export default function Appointments() {
  //Localizer for the calendar:
  require('moment/locale/es.js');
  const localizer = momentLocalizer(moment)

  //Data obtained from the API:
  const [data, setData] = useState([]);

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
          title: item.type + "\nMascota: " + item.pet_id + "\nVet: " + item.user_id,
          start: new Date(item.date),
          end: new Date(startDate.getTime() + 2 * 60 * 60 * 1000)
        };
      });
      setData(formatedData);
    } catch (error) {
      console.error('Error al obtener datos de la API:', error);
    }
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
        />
      </div>
    </Box>
  );

}