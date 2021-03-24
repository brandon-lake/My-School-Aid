import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { v4 as uuid } from 'uuid';

/* This file renders search results for an events search */
const SearchEventsResults = ({
    setPageState,
    searchResults, setSearchResults,
    selectedEvent, setSelectedEvent
}) => {

    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setSuccessMsg("");
            setErrorMsg("");
        }, 3000);

        return () => clearTimeout(timer);
    }, [successMsg, errorMsg]);
    
    const showEventModal = (eventId) => {
        setShowModal(true);
        setSelectedEvent(searchResults.find(e => e.EventID === eventId));
    }

    const searchAgain = (e) => {
        e.preventDefault();
        setPageState("search");
        setSearchResults([]);
        setSelectedEvent({ EventID: "", Title: "", Description: "", StartTime: "", EndTime: "", Type: ""});
        e.target.blur();
    }

    const closeModal = () => {
        setShowModal(false);
        setSelectedEvent({ EventID: "", Title: "", Description: "", StartTime: "", EndTime: "", Type: ""});
    }
    const capitalizeFirst = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    const getSpokenDate = (date) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        var tempDate = new Date(date);

        return tempDate.toLocaleDateString(undefined, options) + " at " + tempDate.toLocaleTimeString('en-US');
    }

    const editEvent = () => {
        setPageState("edit");
    }

    const deleteEvent = () => {
        setLoading(true);
        var formData = new FormData();
        formData.append("dataToQuery", "events");
        formData.append("query", "delete");
        formData.append("eventid", selectedEvent.EventID);

        // do fetch
        fetch("https://csunix.mohawkcollege.ca/~000766089/capstone/backend.php", {
            method: "POST",
            headers: new Headers(),
            body: formData
        }).then(response => {
            return response.json();
        }).then(data => {
            // do something with returned data
            setLoading(false);
            if (data[0] === true) {
                // successful db delete
                setSuccessMsg("Event successfully deleted!");
                setSearchResults(searchResults.filter(e => e.EventID !== selectedEvent.EventID));
            } else {
                // unsuccessful db delete
                setErrorMsg("Could not delete event");
            }
        }).catch(err => {
            // error handling
            setLoading(false);
        }).finally(() => {
            closeModal();
        });
    }

    // this is the modal to show the more specific event info if an event is clicked from the result list
    const modal = (
        <div className="modalScreen">
            <div className="modalContent">
                <div className="container">
                    <div className="row justify-content-center">
                        <h2 className="modalHeader"> { selectedEvent.Title }</h2>
                        <Button disabled={loading} className="close escapeButton" type="button" onClick={() => closeModal()}>X</Button>
                    </div>
                    <hr></hr>
                    <div className="row justify-content-center">
                        <h3><u>{ capitalizeFirst(selectedEvent.Type) } Event</u></h3>
                    </div>
                    <div className="row justify-content-center mt-4">
                        <h5>{ selectedEvent.Description }</h5>
                    </div>
                    <div className="row justify-content-center mt-4">
                        <h3><u>Starts:</u></h3>
                    </div>
                    <div className="row justify-content-center mt-2">
                        <h5>{ getSpokenDate(selectedEvent.StartTime) }</h5>
                    </div>
                    <div className="row justify-content-center mt-4">
                        <h3><u>Ends:</u></h3>
                    </div>
                    <div className="row justify-content-center mt-2">
                        <h5>{ getSpokenDate(selectedEvent.EndTime) }</h5>
                    </div>
                    <div className="row justify-content-center mt-5">
                        <div className="col-1"></div>
                        <div className="col-5">
                            <Button disabled={loading} className="w-100" onClick={() => editEvent()}>Edit</Button>
                        </div>
                        <div className="col-5">
                            <Button disabled={loading} className="w-100 btn-danger" onClick={() => deleteEvent()}>Delete</Button>
                        </div>
                        <div className="col-1"></div>
                    </div>
                </div>
            </div>
        </div>
    );

    const typeColor = {
        "school": orangeColor,
        "work": greenColor,
        "personal": lightblueColor
    }

    // map the result list to a nicer formatted list of items
    const searchResultList = searchResults.map((result) => {
        return (
            <div key={uuid()} className="row listResults pl-4 pr-4" style={typeColor[result.Type]} onClick={() => showEventModal(result.EventID)}>
                {result.Title} - {result.Description.substring(0, 25)} - {getSpokenDate(result.StartTime)}
            </div>
        );
    });

    return (
        <div>
            <div className="text-center">
                <Button className="mb-3" onClick={searchAgain}>Search Again</Button>
            </div>
            
            <div className="container">
                {successMsg.length > 0 && 
                    <h3 className="row justify-content-center text-success">{successMsg}</h3>
                }
                {errorMsg.length > 0 && 
                    <h3 className="row justify-content-center text-danger">{errorMsg}</h3>
                }
            </div>
            
            {searchResultList.length > 0 && 
                <div className="container w-100">
                    {searchResultList}
                </div>
            }
            {showModal === true && modal}
        </div>
    );
    
};

const orangeColor = {
    backgroundColor: "#ff9800"
}
const greenColor = {
    backgroundColor: "#4caf50"
}
const lightblueColor = {
    backgroundColor: "#03a9f4"
}

export default SearchEventsResults;