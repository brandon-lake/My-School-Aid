import React, { useRef, useEffect } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../../../contexts/AuthContext';
import { useHistory } from 'react-router-dom';

/* This file renders the login block */
const Login = ({ setPageState, errorMsg, setErrorMsg, loading, setLoading }) => {

    const emailRef = useRef();
    const passwordRef = useRef();
    const { login, currentUser } = useAuth();
    const history = useHistory();

    useEffect(() => {
        setErrorMsg("");
        if (currentUser != null) {
            if (currentUser.uid === process.env.REACT_APP_ADMIN_USER_ID) {
                history.push("/adminpanel");
            } else {
                history.push("/viewschedule");
            }
        }

    }, [currentUser, history, setErrorMsg]);

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setErrorMsg("");
            setLoading(false);
            await login(emailRef.current.value, passwordRef.current.value);
        } catch (e) {
            setErrorMsg("Failed to log in: " + e);
        }

        setLoading(false);
    }

    const goToSignup = () => {
        setPageState("signup");
    }

    return (
        <div>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Log In</h2>
                    {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
                    <Form>
                        <Form.Group id="email">
                            <Form.Label>Email:</Form.Label>
                            <Form.Control type="email" ref={emailRef} required />
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label>Password:</Form.Label>
                            <Form.Control type="password" ref={passwordRef} required />
                        </Form.Group>
                        
                        <Button disabled={loading} className="w-100" type="submit" onClick={handleSubmit}>Log In</Button>
                    </Form>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                Don't have an account?<Button type="button" variant="link" onClick={goToSignup}>Sign Up Now!</Button>
            </div>
        </div>
    );
};
export default Login;