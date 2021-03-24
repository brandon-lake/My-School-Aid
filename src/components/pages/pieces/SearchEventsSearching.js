import React, { useState } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { useAuth } from '../../../contexts/AuthContext';

/* This file renders the search form, for the user to specify by which fields they would like to search events */
const SearchEventsSearching = ({
    setPageState,
    setSearchResults
}) => {

    const [title, setTitle] = useState("");
    const [type, setType] = useState("");
    const [startRange, setStartRange] = useState("");
    const [endRange, setEndRange] = useState("");
    const [loading, setLoading] = useState(false);
    const { currentUser } = useAuth();

    const updateTitle = (e) => {
        setTitle(e.target.value.trim());
    }
    const updateStartRange = (e) => {
        setStartRange(e.target.value.trim());
    }
    const updateType = (e) => {
        setType(e.target.value.trim());
    }
    const updateEndRange = (e) => {
        setEndRange(e.target.value.trim());
    }

    const searchEvents = (e) => {
        e.preventDefault();
        setLoading(true);

        var formData = new FormData();
        formData.append("dataToQuery", "events");
        formData.append("query", "select");
        formData.append("title", title);
        formData.append("type", type);
        formData.append("startRange", startRange.replace('T', ' '));
        formData.append("endRange", endRange.replace('T', ' '));
        formData.append("userid", currentUser.uid);

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
                setSearchResults(data[1]);
                setPageState("results");
            }
        }).catch(err => {
            // error handling
            setLoading(false);
        });
        
        e.target.blur();
    }

    const clearFields = (e) => {
        e.preventDefault();
        setTitle("");
        setStartRange("");
        setType("");
        setEndRange("");
        e.target.blur();
    }

    return (
        <div>
            <Form>
                <Form.Row id="topRow" className="w-100 justify-content-center mb-3">
                    <Col xs="3" className="mr-3">
                        Title: <Form.Control type="text" value={title} onChange={updateTitle} />
                    </Col>
                    <Col xs="3" className="ml-3">
                        Start Range:<Form.Control type="datetime-local" value={startRange} onChange={updateStartRange} />
                    </Col>
                </Form.Row>
                <Form.Row id="botRow" className="w-100 justify-content-center mb-1">
                    <Col xs="3" className="mr-3">
                        Type: 
                        <Form.Control as="select" value={type} onChange={updateType} >
                            <option value="">--All--</option>
                            <option value="school">School</option>
                            <option value="work">Work</option>
                            <option value="personal">Personal</option>
                        </Form.Control>
                    </Col>
                    <Col xs="3" className="ml-3">
                        End Range:<Form.Control type="datetime-local" value={endRange} onChange={updateEndRange} />
                    </Col>
                </Form.Row>
                <Form.Row id="buttonRow" className="w-100 justify-content-center mt-4">
                    <Col xs="1" className="text-right" >
                        <Button disabled={loading} className="w-100" type="submit" onClick={searchEvents}>Search</Button>
                    </Col>
                    <Col xs="1" className="text-right ml-5" >
                        <Button className="w-100" onClick={clearFields}>Clear Criteria</Button>
                    </Col>
                </Form.Row>
            </Form>
            <div className="w-100 text-center mt-3">
                { loading && "Searching Events..." }
            </div>
        </div>
    );
};

export default SearchEventsSearching;