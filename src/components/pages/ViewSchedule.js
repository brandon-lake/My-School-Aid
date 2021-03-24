import React, { useState } from 'react';
import Calendar from './pieces/ViewCalendar';
import EventsForm from './pieces/EventsForm';

/* This file renders the view schedule page, within which the user can view their calendar or edit events */
const ViewSchedule = () => {

    const [events, setEvents] = useState([]);
    const [pageState, setPageState] = useState("results");
    const [eventToEdit, setEventToEdit] = useState({});

    return (
        <div>
            {pageState === "results" &&
                <Calendar events={events} setEvents={setEvents} setPageState={setPageState} setEventToEdit={setEventToEdit} />
            }
            {pageState === "edit" &&
                <EventsForm pageState={pageState} setPageState={setPageState} eventToEdit={eventToEdit} />
            }
        </div>
    );
}



export default ViewSchedule;