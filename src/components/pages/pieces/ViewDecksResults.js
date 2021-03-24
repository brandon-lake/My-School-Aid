import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

/* This file renders search results for a flashcard deck search  */
const ViewDecksResults = ({
    deckDataList, setDeckDataList, setPageState, currentDeck, setCurrentDeck, setFlashcardList
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

    const showEventModal = (deckId) => {
        setShowModal(true);
        setCurrentDeck(deckDataList.find(e => e.DeckID === deckId));
    }
    const closeModal = () => {
        setShowModal(false);
    }

    const editDeck = () => {
        // query cards
        getDeckCardList("edit");
    }
    const deleteDeck = () => {
        setLoading(true);
        var formData = new FormData();
        formData.append("dataToQuery", "flashcards");
        formData.append("query", "delete");
        formData.append("deckid", currentDeck.DeckID);
        formData.append("target", "decks");

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
                setSuccessMsg("Flashcard Deck successfully deleted!");
                setDeckDataList(deckDataList.filter(d => d.DeckID !== currentDeck.DeckID));
            } else {
                // unsuccessful db delete
                setErrorMsg("Could not delete flashcard deck");
            }
        }).catch(err => {
            // error handling
            setLoading(false);
        }).finally(() => {
            closeModal();
        });
    }

    const searchAgain = (e) => {
        e.preventDefault();
        setPageState("search");
        setDeckDataList([]);
        setCurrentDeck({ EventID: "", Title: "", Description: "", StartTime: "", EndTime: "", Type: ""});
        e.target.blur();
    }

    const takeQuiz = () => {
        var formData = new FormData();
        formData.append("dataToQuery", "flashcards");
        formData.append("query", "increment");
        formData.append("deckid", currentDeck.DeckID);
        // do fetch
        fetch("https://csunix.mohawkcollege.ca/~000766089/capstone/backend.php", {
            method: "POST",
            headers: new Headers(),
            body: formData
        }).then(response => {
            return response.json();
        }).then(data => {
            // do something with returned data
        }).catch(err => {
            // error handling
        });

        getDeckCardList("quiz");
    }

    const getDeckCardList = (newPageState) => {
        setLoading(true);

        // do fetch to get all cards for the current deck
        var formData = new FormData();
        formData.append("dataToQuery", "flashcards");
        formData.append("query", "select");
        formData.append("target", "cards");
        formData.append("deckid", currentDeck.DeckID);

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
                setFlashcardList(data[1]);
            }
        }).catch(err => {
            // error handling
        }).finally(() => {
            closeModal();
            setPageState(newPageState);
        });
    }

    // this is the modal to show more specific flashcard deck info if a deck is clicked from the result list
    const modal = (
        <div className="modalScreen">
            <div className="modalContent">
                <div className="container">
                    <div className="row justify-content-center">
                        <h2 className="modalHeader"> { currentDeck.Title }</h2>
                        <Button disabled={loading} className="close escapeButton" type="button" onClick={() => closeModal()}>X</Button>
                    </div>
                    <hr></hr>
                    <div className="row justify-content-center mt-4">
                        <h5>{ currentDeck.Description }</h5>
                    </div>
                    <div className="row justify-content-center mt-5">
                        <div className="col-1"></div>
                        <div className="col-10">
                            <Button disabled={loading} variant="success" className="w-100" onClick={() => takeQuiz()} >Take Quiz?</Button>
                        </div>
                        <div className="col-1"></div>
                    </div>
                    <div className="row justify-content-center mt-3">
                        <div className="col-1"></div>
                        <div className="col-5">
                            <Button disabled={loading} className="w-100" onClick={() => editDeck()}>Edit</Button>
                        </div>
                        <div className="col-5">
                            <Button disabled={loading} className="w-100 btn-danger" onClick={() => deleteDeck()}>Delete</Button>
                        </div>
                        <div className="col-1"></div>
                    </div>
                </div>
            </div>
        </div>
    );

    // map the result list to a nicer formatted list of items
    const deckList = deckDataList.map((result) => {
        return (
            <div key={result.DeckID} className="row listResults pl-4 pr-4" style={orangeBackground} onClick={() => showEventModal(result.DeckID)}>
                {result.Title} - {result.Description}
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

            {deckList.length > 0 && 
                <div className="container w-100">
                    {deckList}
                </div>
            }
            {showModal && modal}
        </div>
    );
};

const orangeBackground = {
    backgroundColor: "#ff9800"
}

export default ViewDecksResults;