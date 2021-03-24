import React from 'react';
import FlashcardDeckForm from './pieces/FlashcardDeckForm';

/* This file renders the flashcards create deck page */
const FlashcardsCreateDeck = () => {
    return (
        <div>
            <FlashcardDeckForm pageState="create" setPageState={null} deckToEdit={null} cardsToEdit={null} />
        </div>
    );
}

export default FlashcardsCreateDeck;