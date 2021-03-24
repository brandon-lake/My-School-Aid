import React, { useState } from 'react';
import Search from './pieces/ViewDecksSearch';
import Results from './pieces/ViewDecksResults';
import DoDeckQuiz from './pieces/DoDeckQuiz';
import EditDeck from './pieces/FlashcardDeckForm';

/* This file renders the My Decks page, where the user can view/edit/delete/quiz their own decks */
const FlashcardsMyDecks = () => {

    const [pageState, setPageState] = useState("search");
    const [deckDataList, setDeckDataList] = useState([]);
    const [currentDeck, setCurrentDeck] = useState({ DeckID: "", Title: "", Description: "", IsPublic: false });
    const [flashcardList, setFlashcardList] = useState([]);

    return (
        <div>
            { pageState === "search" && 
                <>
                    <h2 className="text-center mt-4 mb-4">Search Flashcard Decks</h2>
                    <Search setDeckDataList={setDeckDataList} setPageState={setPageState} />
                </>
            }
            { pageState === "results" && 
                <>
                    <h2 className="text-center mt-4 mb-4">Flashcard Deck Results</h2>
                    <Results deckDataList={deckDataList} setDeckDataList={setDeckDataList} 
                    setPageState={setPageState} currentDeck={currentDeck} setCurrentDeck={setCurrentDeck}
                    setFlashcardList={setFlashcardList} />
                </>
            }
            { pageState === "quiz" && 
                <>
                    <h2 className="text-center mt-4 mb-4">Taking Quiz!</h2>
                    <DoDeckQuiz deckData={currentDeck} cardList={flashcardList} setPageState={setPageState} /> 
                </>
            }
            { pageState === "edit" && 
                <>
                    <EditDeck pageState={pageState} setPageState={setPageState} deckToEdit={currentDeck} cardsToEdit={flashcardList} /> 
                </>
            }
        </div>
    );
}

export default FlashcardsMyDecks;