import React, { useState, useEffect } from 'react';
import { Form, Col, Button } from 'react-bootstrap';
import FlashcardQuestion from './FlashcardQuestion';
import { v4 as uuid } from 'uuid';
import { useAuth } from '../../../contexts/AuthContext';

/* This file contains the flashcard deck form, which can be rendered in a number of pages.  It is here the user will create/edit flashcard decks. */
const FlashcardDeckForm = ({ pageState, setPageState, deckToEdit, cardsToEdit }) => {

    const [flashcards, setFlashcards] = useState(pageState === "edit" ? cardsToEdit : [{ FlashcardID: uuid(), Question: "", Answer: "" }]);
    const [deckData, setDeckData] = useState(pageState === "edit" ? deckToEdit : { Title: "", Description: "", IsPublic: false });
    const [cardsToDelete, setCardsToDelete] = useState([]);
    const [errorMsg, setErrorMsg] = useState([]);
    const [successMsg, setSuccessMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const { currentUser } = useAuth();

    var localErrorMsg = [];

    useEffect(() => {
        if (deckData.IsPublic === "0" || deckData.IsPublic === "1") {
            setDeckData({ ...deckData, IsPublic: ((deckData.IsPublic === "1") ? true : false) });
        }
    }, [deckData]);
    useEffect(() => {
        const timer = setTimeout(() => {
            setSuccessMsg("");
        }, 3000);

        return () => clearTimeout(timer);
    }, [successMsg]);

    const appendErrorMsg = (str) => {
        localErrorMsg = [ ...localErrorMsg, {id: str.id, msg: str.msg} ];
    }
    const updateTitle = (e) => {
        setDeckData({ ...deckData, Title: e.target.value });
    }
    const updateDescription = (e) => {
        setDeckData({ ...deckData, Description: e.target.value });
    }
    const updateIsPublic = (e) => {
        setDeckData({ ...deckData, IsPublic: e.target.checked });
        e.target.blur();
    }

    const addQuestion = () => {
        let localFlashcards = [...flashcards];
        localFlashcards.push({ FlashcardID: uuid(), Question: "", Answer: ""});
        setFlashcards(localFlashcards);
    }

    function validateInputs() {
        var allValid = true;
        var count = 0;

        if (deckData.Title.trim() === null || deckData.Title.trim() === "") {
            allValid = false;
            appendErrorMsg({id: count++, msg: "Must enter a title!"});
        } else if (deckData.Title.trim().length > 50) {
            allValid = false;
            appendErrorMsg({id: count++, msg: "Title must be 50 characters or less!"});
        }

        if (deckData.Description.trim() === null || deckData.Description.trim() === "") {
            allValid = false;
            appendErrorMsg({id: count++, msg: "Must enter a description!"});
        } else if (deckData.Description.trim().length > 150) {
            allValid = false;
            appendErrorMsg({id: count++, msg: "Description must be 150 characters or less!"});
        }

        // loop through all flashcards and make sure they all have a question and answer
        //      if question AND answer are both missing, drop that entry
        let localFlashcards = [...flashcards];  // create local variable as we may be splicing and react useState is async
        for (var i = localFlashcards.length - 1; i >= 0; i--) {
            // both question and answer empty - splice this entry if it is not the only one
            if (localFlashcards[i].Question.trim() === "" && localFlashcards[i].Answer.trim() === "") {
                if (localFlashcards.length > 1) {
                    localFlashcards.splice(i, 1);
                } else {
                    allValid = false;
                    appendErrorMsg({id: count++, msg: "Flashcard deck must have at least one question!"});    
                }
            } else if (localFlashcards[i].Question.trim() === "") {
                allValid = false;
                appendErrorMsg({id: count++, msg: "No flashcards can have an empty question!"});
            } else if (localFlashcards[i].Answer.trim() === "") {
                allValid = false;
                appendErrorMsg({id: count++, msg: "No flashcards can have an empty answer!"});
            } else {
                if (localFlashcards[i].Question.trim().length > 150) {
                    allValid = false;
                    appendErrorMsg({id: count++, msg: `Flashcard questions must be 150 characters or less.  Card ${i + 1} currently: ${localFlashcards[i].Question.trim().length}`});
                }
                
                if (localFlashcards[i].Answer.trim().length > 50) {
                    allValid = false;
                    appendErrorMsg({id: count++, msg: `Flashcard answers must be 50 characters or less.  Card ${i + 1} currently: ${localFlashcards[i].Answer.trim().length}`});
                }
            }
        }
        setErrorMsg(localErrorMsg);
        return allValid;
    }

    function createDeck(e) {
        e.preventDefault();
        localErrorMsg = [];
        setSuccessMsg("");

        if (validateInputs()) {
            setLoading(true);
            var formData = new FormData();
            formData.append("dataToQuery", "flashcards");
            if (pageState === "create") {
                formData.append("query", "create");
                formData.append("deckid", uuid());
            } else {
                formData.append("query", "edit");
                formData.append("deckid", deckData.DeckID);
                formData.append("deletelist", JSON.stringify(cardsToDelete));
            }

            formData.append("title", deckData.Title);
            formData.append("description", deckData.Description);
            formData.append("ispublic", deckData.IsPublic);
            formData.append("cards", JSON.stringify(flashcards.filter(fc => fc.Question.trim() !== "" && fc.Answer.trim() !== "")));
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
                    // successful db insert
                    if (pageState === "create") {
                        setSuccessMsg("Deck successfully created!");
                    } else {
                        setSuccessMsg("Deck successfully edited!");
                    }
                    window.scrollTo(0, 0);
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
        }
    }

    const clearForm = () => {
        setDeckData({ Title: "", Description: "", IsPublic: false });
        setFlashcards([{ FlashcardID: uuid(), Question: "", Answer: "" }]);
    }
    const endEditing = () => {
        setPageState("results");
    }

    const questionList = flashcards.map((card) => {
        return (
            <FlashcardQuestion key={card.FlashcardID} card={card} flashcards={flashcards} setFlashcards={setFlashcards} pageState={pageState}
            cardsToDelete={cardsToDelete} setCardsToDelete={setCardsToDelete} loading={loading} />
        );
    });

    return (
        <div className="extendableForm">
            <h2 className="text-center mt-4 mb-4">
                {pageState === "create" && "Create New Flashcard Deck"}
                {pageState === "edit" && "Edit Flashcard Deck"}
            </h2>

            {successMsg.length > 0 && 
                <div className="text-success text-center mb-4 w-100">
                    <h3>{successMsg}</h3>
                </div>
            }
            {errorMsg.length > 0 &&
                <div className="container text-danger w-100">
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
            <Form>
                <Form.Row id="title" className="w-100 justify-content-center mb-1">
                    <Col xs="1" className="text-right">
                        <Form.Label className="mb-0">Title:</Form.Label>
                    </Col>
                    <Col xs="3">
                        <Form.Control className="w-100" type="text" value={deckData.Title} onChange={updateTitle} required />
                    </Col>
                    <Col xs="1" />
                </Form.Row>
                <Form.Row id="description" className="w-100 justify-content-center mb-1">
                    <Col xs="1" className="text-right">
                        <Form.Label>Description:</Form.Label>
                    </Col>
                    <Col xs="3">
                        <Form.Control className="w-100" as="textarea" rows={2} value={deckData.Description} onChange={updateDescription} required />
                    </Col>
                    <Col xs="1" />
                </Form.Row>
                <Form.Row id="ispublic" className="w-100 justify-content-center mb-1">
                    <Col xs="1" className="text-right">
                        <Form.Label>Public:</Form.Label>
                    </Col>
                    <Col xs="3">
                        <Form.Control type="checkbox" checked={deckData.IsPublic} onChange={updateIsPublic} required />
                    </Col>
                    <Col xs="1" />
                </Form.Row>

                <div className="row w-100 justify-content-center mt-5"><h3>Questions:</h3></div>
                { questionList }
                <Form.Row className="w-100 justify-content-center mt-3">
                    <Col xs="2" />
                    <Col xs="2">
                        <Button disabled={loading} onClick={addQuestion}>Add Question</Button>
                    </Col>
                    { pageState === "edit" && 
                        <Col xs="1">
                            <Button disabled={loading} className="w-100" onClick={endEditing}>Return</Button>
                        </Col>
                    }
                    { pageState === "create" && <Col xs="1" /> }
                    <Col xs="2" />
                </Form.Row>
                <Form.Row className="w-100 justify-content-center mt-4">
                    <Col xs="3">
                        <Button disabled={loading} className="w-100" onClick={createDeck}>
                            <h5 className="mb-0">{ pageState === "create" ? "Create Flashcard Deck!" : "Submit Changes!" }</h5>
                        </Button>
                    </Col>
                </Form.Row>
            </Form>
        </div>
    );
};

export default FlashcardDeckForm;