import React, { useState } from 'react';
import { Form, Col, Button } from 'react-bootstrap';
import { useAuth } from '../../../contexts/AuthContext';

/* This file renders the search form, for the user to specify by which fields they would like to search flashcard decks */
const ViewDecksSearch = ({ 
    setDeckDataList, setPageState
}) => {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const { currentUser } = useAuth();

    const updateTitle = (e) => {
        setTitle(e.target.value);
    }
    const updateDescription = (e) => {
        setDescription(e.target.value);
    }

    const searchDecks = (e) => {
        e.preventDefault();
        setLoading(true);

        // do fetch to get all decks by user id
        var formData = new FormData();
        formData.append("dataToQuery", "flashcards");
        formData.append("query", "select");
        formData.append("target", "decks");
        formData.append("userid", currentUser.uid);
        formData.append("title", title);
        formData.append("description", description);

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
                setDeckDataList(data[1]);
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
        setDescription("");
        e.target.blur();
    }

    return (
        <div>
            <Form>
                <Form.Row id="topRow" className="w-100 justify-content-center mb-3">
                    <Col xs="3" className="mr-3">
                        Title: <Form.Control type="text" value={title} onChange={updateTitle} />
                    </Col>
                </Form.Row>
                <Form.Row id="botRow" className="w-100 justify-content-center mb-1">
                    <Col xs="3" className="mr-3">
                        Description: <Form.Control type="text" value={description} onChange={updateDescription} />
                    </Col>
                </Form.Row>
                <Form.Row id="buttonRow" className="w-100 justify-content-center mt-4">
                    <Col xs="1" className="text-right" >
                        <Button disabled={loading} className="w-100" type="submit" onClick={searchDecks}>Search</Button>
                    </Col>
                    <Col xs="1" className="text-right ml-5" >
                        <Button className="w-100" onClick={clearFields}>Clear Criteria</Button>
                    </Col>
                </Form.Row>
            </Form>
        </div>
    );
};

export default ViewDecksSearch;