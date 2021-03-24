import React, { useState, useEffect } from 'react';
import DoDeckQuiz from './pieces/DoDeckQuiz';
import { Button } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';

/* This file renders the flashcards home page, which will display all public decks from all users other than the current user 
(the current user will use their own decks from the "My Decks" page) */
const FlashcardsHome = () => {
    const [pageState, setPageState] = useState("results");  // results/quiz
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [deckDataList, setDeckDataList] = useState([]);
    const [currentDeck, setCurrentDeck] = useState({ DeckID: "", Title: "", Description: "" });
    const [flashcardList, setFlashcardList] = useState([]);
    const { currentUser } = useAuth();
    const controller = new AbortController();
    const signal = controller.signal;

    useEffect(() => {
        // do fetch to get all public decks by other users
        var formData = new FormData();
        formData.append("dataToQuery", "flashcards");
        formData.append("query", "select");
        formData.append("target", "public");
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
                setDeckDataList(data[1]);
                setPageState("results");
            }
        }).catch(err => {
            // error handling
            setLoading(false);
        });

        return () => {
            controller.abort();
        }
    }, []);

    const showEventModal = (deckId) => {
        setShowModal(true);
        setCurrentDeck(deckDataList.find(e => e.DeckID === deckId));
    }
    const closeModal = () => {
        setShowModal(false);
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

        getDeckCardList();
    }
    const getDeckCardList = () => {
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
            setPageState("quiz");
        });
    }

    // modal to display specific information about the selected flashcard deck from the results list
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
                </div>
            </div>
        </div>
    );

    // map the results into a nicer looking result list
    const deckList = deckDataList.map((result) => {
        return (
            <div key={result.DeckID} className="row listResults pl-4 pr-4" style={orangeBackground} onClick={() => showEventModal(result.DeckID)}>
                {result.Title} - {result.Description}
            </div>
        );
    });

    return (
        <div>
            {pageState === "results" && 
                <>
                    <h2 className="text-center mt-4 mb-4">Flashcards Home</h2>
                    <h5 className="text-center mb-4">Below are some public decks made by other users which you may use to quiz yourself</h5>

                    {deckList.length > 0 && 
                        <div className="container w-100">
                            {deckList}
                        </div>
                    }
                    {showModal && modal}
                </>
            }
            { pageState === "quiz" && 
                <>
                    <h2 className="text-center mt-4 mb-4">Taking Quiz!</h2>
                    <DoDeckQuiz deckData={currentDeck} cardList={flashcardList} setPageState={setPageState} /> 
                </>
            }
        </div>
    );
}

const orangeBackground = {
    backgroundColor: "#ff9800"
}

export default FlashcardsHome;