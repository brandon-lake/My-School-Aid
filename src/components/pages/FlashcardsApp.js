import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import FlashcardHeader from '../layout/FlashcardHeader';
import FlashcardsHome from './FlashcardsHome';
import FlashcardsMyDecks from './FlashcardsMyDecks';
import FlashcardsCreateDeck from './FlashcardsCreateDeck';
import NoMatch from "./InvalidURL";
import PrivateRoute from '../pages/pieces/PrivateRoute';

/* This file renders the flashcards app, contained within the base app.  It was structured like this such that I could create a two tiered navbar */
const FlashcardsApp = () => {
    return (
        <div>
            <Router>
                <FlashcardHeader />
                {/* -------Route Options------- */}
                <Switch>
                    <PrivateRoute path="/flashcard/" exact component={FlashcardsHome} />
                    <PrivateRoute path="/flashcard/home" component={FlashcardsHome} />
                    <PrivateRoute path="/flashcard/mydecks" component={FlashcardsMyDecks} />
                    <PrivateRoute path="/flashcard/createdeck" component={FlashcardsCreateDeck} />
                    <Route component={NoMatch} />
                </Switch>
                {/* -----End Route Options----- */}
            </Router>
        </div>
        
    );
}

export default FlashcardsApp;