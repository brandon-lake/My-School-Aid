import React, { useState, useEffect } from "react";
import { Form, Button, Col } from 'react-bootstrap';
import { useAuth } from '../../../contexts/AuthContext';

/* This file contains the events form, which can be rendered from within a number of pages.  It is here the user will create/edit events */
const EventsForm = ({
    pageState, setPageState, eventToEdit
}) => {

    const [title, setTitle] = useState(pageState === "edit" ? eventToEdit.Title : "");
    const [description, setDescription] = useState(pageState === "edit" ? eventToEdit.Description : "");
    const [type, setType] = useState(pageState === "edit" ? eventToEdit.Type : "school");
    const [startTime, setStartTime] = useState(pageState === "edit" ? eventToEdit.StartTime.replace(' ', 'T') : "");
    const [endTime, setEndTime] = useState(pageState === "edit" ? eventToEdit.EndTime.replace(' ', 'T') : "");
    const [frequency, setFrequency] = useState(pageState === "edit" ? eventToEdit.Frequency : "once");
    const [errorMsg, setErrorMsg] = useState([]);
    const [successMsg, setSuccessMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const { currentUser } = useAuth();
    const controller = new AbortController();
    const signal = controller.signal;

    var localErrorMsg = [];

    useEffect(() => {
        return () => {
            controller.abort();
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSuccessMsg("");
        }, 3000);

        return () => clearTimeout(timer);
    }, [successMsg]);

    const updateTitle = (e) => {
        setTitle(e.target.value);
    }
    const updateDescription = (e) => {
        setDescription(e.target.value);
    }
    const updateType = (e) => {
        setType(e.target.value.trim());
    }
    const updateStartTime = (e) => {
        setStartTime(e.target.value);
    }
    const updateEndTime = (e) => {
        setEndTime(e.target.value);
    }
    const updateFrequency = (e) => {
        setFrequency(e.target.value.trim());
    }
    const appendErrorMsg = (str) => {
        localErrorMsg = [ ...localErrorMsg, {id: str.id, msg: str.msg} ];
    }

    function validateInputs() {
        var allValid = true;
        var count = 0;

        if (title.trim() === null || title.trim() === "") {
            allValid = false;
            appendErrorMsg({id: count++, msg: "Must enter a title!"});
        } else if (title.trim().length > 50) {
            allValid = false;
            appendErrorMsg({id: count++, msg: "Title must be 50 characters or less!"});
        }

        if (description.trim() === null || description.trim() === "") {
            allValid = false;
            appendErrorMsg({id: count++, msg: "Must enter a description!"});
        } else if (description.trim().length > 150) {
            allValid = false;
            appendErrorMsg({id: count++, msg: "Description must be 150 characters or less!"});
        }

        if (type.trim() !== "school" && type.trim() !== "work" && type.trim() !== "personal") {
            allValid = false;
            appendErrorMsg({id: count++, msg: "Type must be one of: school, work, or personal!"});
        }

        if (startTime === "") {
            allValid = false;
            appendErrorMsg({id: count++, msg: "Must enter a Start Time!"});
        }
        if (endTime === "") {
            allValid = false;
            appendErrorMsg({id: count++, msg: "Must enter an End Time!"});
        }

        if (Date.parse(startTime) > Date.parse(endTime)) {
            allValid = false;
            appendErrorMsg({id: count++, msg: "Start time must be before End time!"});
        }

        if (frequency.trim() !== "once" && frequency.trim() !== "daily" && frequency.trim() !== "weekly" && frequency.trim() !== "monthly") {
            allValid = false;
            appendErrorMsg({id: count++, msg: "Frequency must be one of: once, daily, weekly, or monthly!"});
        }

        setErrorMsg(localErrorMsg);

        return allValid;
    }

    function createEvent(e) {
        e.preventDefault();
        localErrorMsg = [];
        setSuccessMsg("");

        if (validateInputs()) {
            setLoading(true);
            var formData = new FormData();
            formData.append("dataToQuery", "events");

            if (pageState === "create") {
                formData.append("query", "create");
            } else {
                formData.append("query", "edit");
                formData.append("eventid", eventToEdit.EventID);
            }
            
            formData.append("title", title.trim());
            formData.append("description", description.trim());
            formData.append("type", type);
            formData.append("startTime", startTime.replace('T', ' '));
            formData.append("endTime", endTime.replace('T', ' '));
            formData.append("frequency", frequency);
            formData.append("userid", currentUser.uid);

            // do fetch
            fetch("https://csunix.mohawkcollege.ca/~000766089/capstone/backend.php", {
                method: "POST",
                headers: new Headers(),
                body: formData,
                signal: signal
            }).then(response => {
                return response.json();
            }).then(data => {
                // do something with returned data
                setLoading(false);
                if (data[0] === true) {
                    // successful db insert
                    if (pageState === "create") {
                        setSuccessMsg("Event successfully created!");
                    } else {
                        setSuccessMsg("Event successfully edited!");
                    }
                    localErrorMsg = [];
                    if (pageState === "create") {
                        clearForm();
                    }
                } else {
                    // unsuccessful db insert
                    appendErrorMsg({ id: 0, msg: "Could not insert event into Database - " + data[1]});
                }
            }).catch(err => {
                // error handling
                appendErrorMsg({ id: 0, msg: "Unable to insert event into Database, please contact site Administrator"});
                setLoading(false);
            }).finally(() => {
                setErrorMsg(localErrorMsg);
            });
        } else {
            // not all valid
        }
        
        e.target.blur();
    }

    const clearForm = () => {
        setTitle("");
        setDescription("");
        setType("school");
        setStartTime("");
        setEndTime("");
        setFrequency("once");
    }

    const endEditing = () => {
        setPageState("results");
    }

    return (
        <div>
            <h2 className="text-center mt-4 mb-4">
                {pageState === "create" && "Create New Event"}
                {pageState === "edit" && "Edit Event"}
            </h2>
            <Form>
                <Form.Row id="title" className="w-100 justify-content-center mb-1">
                    <Col xs="1" className="text-right">
                        <Form.Label className="mb-0">Title:</Form.Label>
                    </Col>
                    <Col xs="3">
                        <Form.Control className="w-75" type="text" value={title} onChange={updateTitle} required />
                    </Col>
                </Form.Row>
                <Form.Row id="description" className="w-100 justify-content-center mb-1">
                    <Col xs="1" className="text-right">
                        <Form.Label>Description:</Form.Label>
                    </Col>
                    <Col xs="3">
                        <Form.Control className="w-75" as="textarea" rows={3} value={description} onChange={updateDescription} required />
                    </Col>
                </Form.Row>
                <Form.Row id="type" className="w-100 justify-content-center mb-1">
                    <Col xs="1" className="text-right">
                        <Form.Label>Type:</Form.Label>
                    </Col>
                    <Col xs="3">
                        <Form.Control className="w-50" as="select" value={type} onChange={updateType} required >
                            <option value="school">School</option>
                            <option value="work">Work</option>
                            <option value="personal">Personal</option>
                        </Form.Control>
                    </Col>
                </Form.Row>
                <Form.Row id="startTime" className="w-100 justify-content-center mb-1">
                    <Col xs="1" className="text-right">
                        <Form.Label>Start Time:</Form.Label>
                    </Col>
                    <Col xs="3">
                        <Form.Control className="w-75" type="datetime-local" value={startTime} onChange={updateStartTime} required />
                    </Col>
                </Form.Row>
                <Form.Row id="endTime" className="w-100 justify-content-center mb-1">
                    <Col xs="1" className="text-right">
                        <Form.Label>End Time:</Form.Label>
                    </Col>
                    <Col xs="3">
                        <Form.Control className="w-75" type="datetime-local" value={endTime} onChange={updateEndTime} required />
                    </Col>
                </Form.Row>
                <Form.Row id="frequency" className="w-100 justify-content-center">
                    <Col xs="1" className="text-right">
                        <Form.Label>Frequency:</Form.Label>
                    </Col>
                    <Col xs="3">
                        <Form.Control className="w-50" as="select" value={frequency} onChange={updateFrequency} required >
                            <option value="once">Just Once</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </Form.Control>
                    </Col>
                </Form.Row>
                <Form.Row id="buttonRow" className="w-100 justify-content-center mt-4">
                    <Col xs="1" className="text-right" >
                        <Button disabled={loading} className="w-100" type="submit" onClick={createEvent}>
                            { pageState === "create" && "Create"}
                            { pageState === "edit" && "Edit"}
                        </Button>
                    </Col>
                    { pageState === "edit" ? 
                        <Col xs="1">
                            <Button disabled={loading} className="w-100 ml-5" onClick={endEditing}>Return</Button>
                        </Col>
                    : pageState !== "edit" && <Col xs="1"/> }
                </Form.Row>
            </Form>

            {errorMsg.length > 0 &&
                <div className="container mt-5 text-danger w-100">
                    <div className="row justify-content-center">
                        <h3>Must correct the following errors to submit the form:</h3>
                    </div>
                    <div className="row justify-content-center mt-3">
                        <ul className="w-25 text-center">
                            {errorMsg.map((e) => <li key={e.id}><span>{e.msg}</span></li>)}
                        </ul>
                    </div>
                </div>
            }
            {successMsg.length > 0 && 
                <div className="text-success text-center mt-5 w-100">
                    <h3>{successMsg}</h3>
                </div>
            }
        </div>
    );
};

export default EventsForm;