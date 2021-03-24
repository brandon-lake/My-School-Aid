import React from "react";
import EventsForm from "./pieces/EventsForm";

/* This file renders the Create events page */
const CreateEvents = () => {
    return (
        <EventsForm pageState="create" setPageState={null} eventToEdit={null} />
    );
};

export default CreateEvents;
