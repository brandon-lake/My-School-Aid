import React, { useState, useEffect } from 'react';
import { Form, Col, Button } from 'react-bootstrap';

/* This file renders one flashcard question within the flashcard form, including its question, its answer, and its own delete button */
const FlashcardQuestion = ({ 
    card, flashcards, setFlashcards, pageState, 
    cardsToDelete, setCardsToDelete, loading 
}) => {

    const [canDelete, setCanDelete] = useState(false);
    
    useEffect(() => {
        if (flashcards.length > 1) {
            setCanDelete(true);
        } else {
            setCanDelete(false);
        }
    }, [flashcards]);

    const updateQuestion = (e) => {        
        let localFlashcards = [...flashcards];

        for (var i = 0; i < localFlashcards.length; i++) {
            if (localFlashcards[i].FlashcardID === card.FlashcardID) {
                localFlashcards[i].Question = e.target.value;
                break;
            }
        }

        setFlashcards(localFlashcards);
    }

    const updateAnswer = (e) => {
        let localFlashcards = [...flashcards];

        for (var i = 0; i < localFlashcards.length; i++) {
            if (localFlashcards[i].FlashcardID === card.FlashcardID) {
                localFlashcards[i].Answer = e.target.value;
                break;
            }
        }

        setFlashcards(localFlashcards);
    }

    const deleteQuestion = () => {
        if (pageState === "edit") {
            let deleteList = [...cardsToDelete, flashcards.find(fc => fc.FlashcardID === card.FlashcardID)];
            setCardsToDelete(deleteList);
        }
        let localFlashcards = [...flashcards].filter(fc => fc.FlashcardID !== card.FlashcardID);
        setFlashcards(localFlashcards);
    }

    return (
        <div>
            <Form.Row className="w-100 justify-content-center mt-4 mb-1">
                <Col xs="1 text-right">
                    <Button disabled={!canDelete || loading} tabIndex="-1" variant="danger" onClick={deleteQuestion}>Delete</Button>
                </Col>
                <Col xs="1" className="text-right">
                    <Form.Label className="mb-0">Question:</Form.Label>
                </Col>
                <Col xs="3">
                    <Form.Control className="w-100" type="text" value={card.Question} onChange={updateQuestion} required />
                </Col>
                <Col xs="1" />
                <Col xs="1" />
            </Form.Row>
            <Form.Row className="w-100 justify-content-center">
                <Col xs="1" className="text-right">
                    <Form.Label className="mb-0">Answer:</Form.Label>
                </Col>
                <Col xs="3">
                    <Form.Control className="w-100" type="text" value={card.Answer} onChange={updateAnswer} required />
                </Col>
                <Col xs="1" />
            </Form.Row>            
        </div>
    );
};

export default FlashcardQuestion;