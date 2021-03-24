import React, { useEffect, useRef } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../../../contexts/AuthContext';
import { useHistory } from 'react-router-dom';

/* This file renders the signup block */
const Signup = ({ setPageState, errorMsg, setErrorMsg, loading, setLoading }) => {

    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const { signup } = useAuth();
    const history = useHistory();

    useEffect(() => {
        setErrorMsg("");
    }, [history, setErrorMsg]);

    async function handleSubmit(e) {
        e.preventDefault();

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            setErrorMsg("Passwords do not match!");
            return;
        }

        try {
            setErrorMsg("");
            setLoading(false);
            await signup(emailRef.current.value, passwordRef.current.value);
            history.push("/viewschedule");
        } catch (e) {
            setErrorMsg("Failed to create account: " + e);
        }
        
        setLoading(false);
    }

    const goToLogin = () => {
        setPageState("login");
    }

    return (
        <div>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Sign Up</h2>
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
                        <Form.Group id="password-confirm">
                            <Form.Label>Password Confirmation:</Form.Label>
                            <Form.Control type="password" ref={passwordConfirmRef} required />
                        </Form.Group>
                        <Button disabled={loading} className="w-100" type="submit" onClick={handleSubmit}>Sign Up</Button>
                    </Form>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                Already have an account?<Button type="button" variant="link" onClick={goToLogin}>Log In</Button>
            </div>
        </div>
    );
};

export default Signup;