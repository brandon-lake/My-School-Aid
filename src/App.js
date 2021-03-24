import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import ViewSchedule from "./components/pages/ViewSchedule";
import CreateEvents from "./components/pages/CreateEvents";
import SearchEvents from "./components/pages/SearchEvents";
import FlashcardsApp from "./components/pages/FlashcardsApp";
import FlashcardsHome from './components/pages/FlashcardsHome';
import FlashcardsMyDecks from './components/pages/FlashcardsMyDecks';
import FlashcardsCreateDeck from './components/pages/FlashcardsCreateDeck';
import NoMatch from "./components/pages/InvalidURL";
import { AuthProvider } from "./contexts/AuthContext";
import UserAuthentication from "./components/pages/UserAuthentication";
import AdminPanel from './components/pages/AdminPanel';
import PrivateRoute from './components/pages/pieces/PrivateRoute';

/* This file renders app, and specifies all valid routes */
const App = () => {   
    return (
        <Router>
            <AuthProvider>
                <Header />
                {/* -------Route Options------- */}
                <Switch>
                    <PrivateRoute path="/" exact component={ViewSchedule} />
                    <PrivateRoute path="/viewschedule" component={ViewSchedule} />
                    <PrivateRoute path="/createevents" component={CreateEvents} />
                    <PrivateRoute path="/searchevents" component={SearchEvents} />
                    <PrivateRoute path="/flashcard/" component={FlashcardsApp} />
                    <PrivateRoute path="/flashcard/home" component={FlashcardsHome} />
                    <PrivateRoute path="/flashcard/mydecks" component={FlashcardsMyDecks} />
                    <PrivateRoute path="/flashcard/createdeck" component={FlashcardsCreateDeck} />
                    <PrivateRoute path="/adminpanel" exact component={AdminPanel} />
                    <Route path="/loginsignup" component={UserAuthentication} />
                    <Route component={NoMatch} />
                </Switch>
                {/* -----End Route Options----- */}
            </AuthProvider>
        </Router>
    );
}

export default App;