import React, { useState } from 'react';
import Signup from './pieces/Signup';
import Login from './pieces/Login';
import { Container } from 'react-bootstrap';

/* This file renders the base user authentication page, within which the login and signup are both rendered */
const UserAuthentication = () => {

    const [pageState, setPageState] = useState("login");
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);

    return (
        <div>
            <Container className="d-flex align-items-center justify-content-center">
                <div className="w-100 mt-5" style={{ maxWidth: "400px" }}>
                    {pageState === "login" &&
                        <Login setPageState={setPageState} errorMsg={errorMsg} setErrorMsg={setErrorMsg} 
                            loading={loading} setLoading={setLoading} />
                    }
                    {pageState === "signup" &&
                        <Signup setPageState={setPageState} errorMsg={errorMsg} setErrorMsg={setErrorMsg} 
                            loading={loading} setLoading={setLoading} />
                    }
                    
                </div>
            </Container>
        </div>
    );
};

export default UserAuthentication;