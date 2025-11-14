import { useEffect, useState } from "react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { useAuth } from "../hooks/useAuth";
import { createDayPlan } from "../services/DayPlanService";
import { useNavigate } from "react-router-dom";
import "../index.css";

registerLocale("es", es);

const localizer = dayjsLocalizer(dayjs);

const initialEvents = [
  {
    title: "Hora de entrenar",
    start: dayjs("2024-06-28T12:00:00").toDate(),
    end: dayjs("2024-06-28T13:00:00").toDate(),
  },
];

const CalendarPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
  });
  const [allEvents, setAllEvents] = useState([]);

  
   //Guardar eventos en localStorage cada vez que se actualizan
   useEffect(() => {
     try {
       localStorage.setItem("events", JSON.stringify(allEvents));
     } catch (error) {
       console.error("Error saving events to localStorage:", error);
     }
   }, [allEvents]);

  const fetchDailyMealPlan = () => {
    const startDate = new Date().toISOString();
    const userPreferences = {
      objetive: user.objetive,
      ability: user.ability,
      typeDiet: user.typeDiet,
      alergic: user.alergic,
    };
    const userId = user._id;

    createDayPlan({ startDate, userPreferences, userId })
      .then((response) => {
        console.log(response);
        const { dailyMealPlan } = response;
        console.log(dailyMealPlan);
        if (!dailyMealPlan.date) {
          console.error("Error: 'date' is undefined in the response");
          return;
        }
        const eventsFromPlan = dailyMealPlan.meals.map((meal) => ({
          recipeId: meal.meal.recipe._id,
          title: meal.meal.name,
          start: dayjs(dailyMealPlan.date)
            .hour(dayjs(meal.time).hour())
            .minute(dayjs(meal.time).minute())
            .toDate(),
          end: dayjs(dailyMealPlan.date)
            .hour(dayjs(meal.time).hour())
            .minute(dayjs(meal.time).minute() + 30)
            .toDate(), // Supongamos que cada comida dura 30 minutos
        }));
        console.log("***************EVENTOS", eventsFromPlan);
        setAllEvents((prevEvents) => [...prevEvents, ...eventsFromPlan]);
      })
      .catch((error) => {
        console.error("Error fetching meal plan:", error);
      });
  };

  const handleCreateDailyPlan = () => {
    fetchDailyMealPlan();
  };

  //funcion para añadir nuevos eventos
  const handleAddEvent = () => {
    const updatedEvents = [...allEvents, newEvent];
    setAllEvents(updatedEvents);

  };

  // Función para manejar el clic en un evento
  const handleSelectEvent = (event) => {
    navigate(`/recipes/${event.recipeId}`); // Navega a la página de detalles de la receta
  };

  return (
    <div className="container mt-3">
      <h2>Añade una actividad</h2>
      <div className="mb-3">
        <label htmlFor="title" className="form-label"></label>
        <input
          type="text"
          className="form-control"
          id="title"
          placeholder="Nueva actividad"
          value={newEvent.title}
          style={{ borderColor: "#83A580" }}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
        />
      </div>
      <DatePicker
        locale="es"
        placeholderText="Inicio"
        style={{ marginRight: "10px", borderColor: "#83A580" }}
        className="mb-3"
        selected={newEvent.start}
        onChange={(start) => setNewEvent({ ...newEvent, start })}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        timeCaption="Hora"
        dateFormat="MMMM d, yyyy h:mm aa"
        portalId="root-portal"
      />

      <DatePicker
        locale="es"
        placeholderText="Fin"
        style={{ marginRight: "10px", borderColor: "#83A580" }}
        selected={newEvent.end}
        onChange={(end) => setNewEvent({ ...newEvent, end })}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        timeCaption="Hora"
        dateFormat="MMMM d, yyyy h:mm aa"
        portalId="root-portal"
      />
      <div className="container">
        <button className="btn btn-custom mt-3 me-3" onClick={handleAddEvent}>
          Añadir actividad
        </button>
        <button className="btn btn-custom mt-3" onClick={handleCreateDailyPlan}>
          Crea un plan diario
        </button>
      </div>
      <Calendar
        localizer={localizer}
        events={allEvents.filter(
          (event) => event.title && event.start && event.end
        )}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, margin: "50px", backgroundColor: "#83A580" }}
        culture="es"
        views={["week", "day"]} // Only show week and day views
        messages={{
          month: "Mes",
          week: "Semana",
          day: "Día",
        }}
        defaultView="day"
        onSelectEvent={handleSelectEvent} // Agrega el manejador de eventos
      />
    </div>
  );
};

export default CalendarPage;
