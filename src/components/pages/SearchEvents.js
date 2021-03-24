import React, { useState } from 'react';
import Searching from './pieces/SearchEventsSearching';
import Results from './pieces/SearchEventsResults';
import EventsForm from './pieces/EventsForm';

/* This file renders the search events page, where the user can search through their own events via a number of different fields */
const SearchEvents = () =>  {
    
    const [pageState, setPageState] = useState("search");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState({ EventID: "", Title: "", Description: "", StartTime: "", EndTime: "", Type: ""});

    return (
        <div>
            {pageState === "search" &&
            <div>
                <h2 className="text-center mt-4 mb-4">Search Events</h2>
                <Searching 
                    setPageState={setPageState}
                    setSearchResults={setSearchResults}
                />
            </div>
                
            }
            {pageState === "results" &&
                <div>
                    <h2 className="text-center mt-4 mb-4">Results</h2>
                    <Results
                        setPageState={setPageState}
                        searchResults={searchResults} setSearchResults={setSearchResults}
                        selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent}
                    />
                </div>
            }
            {pageState === "edit" &&
                <EventsForm pageState="edit" setPageState={setPageState} eventToEdit={selectedEvent} />
            }
        </div>
    );
}

export default SearchEvents;