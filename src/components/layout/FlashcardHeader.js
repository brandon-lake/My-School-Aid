import React from 'react';
import { NavLink } from 'react-router-dom';

const FlashcardHeader = () => {
    return (
        <div>
			<nav className="navbar navbar-dark bg-dark secondNav" style={navRow}>
                <NavLink className="NavLink w-25 text-center navBlock" activeStyle={active} 
                    exact to="/flashcard/home">Flashcards Home</NavLink>

                <NavLink className="NavLink w-25 text-center navBlock" activeStyle={active}  
                    to="/flashcard/mydecks">My Flashcard Decks</NavLink>

                <NavLink className="NavLink w-25 text-center navBlock" activeStyle={active}
                    to="/flashcard/createdeck">Create Flashcard Decks</NavLink>
                    
                <div className="w-25"></div>
            </nav>
        </div>
    );
}

const active = {
	backgroundColor: "rgb(62, 126, 126)"
}
const navRow = {
	padding: "0px",
}

export default FlashcardHeader;