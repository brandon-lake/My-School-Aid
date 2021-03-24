import React, { useEffect, useRef } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useHistory } from 'react-router-dom';
import { Button } from 'react-bootstrap';

/* This file renders the modal to display when the user icon in the top right corner of the screen is clicked.  This is where the user can log out if they would like */
const UserModal = ({ setShowModal }) => {

    const modalRef = useRef();
    const { currentUser, logout } = useAuth();
    const history = useHistory();

    useEffect(() => {
        modalRef.current.focus();
    }, []);
    
    const handleBlur = () => {
        setShowModal(false);
    }

    async function handleLogout() {
		try {
            setShowModal(false);
			await logout();
			history.push("/loginsignup");
		} catch (e) {
		}
    }

    return (
        <div ref={modalRef} style={bringToFront} onBlur={handleBlur} tabIndex="0" className="userModal container">
            <div className="row justify-content-center mt-3">
                <h2>Hello,</h2>
                <Button className="close escapeButton" type="button" onClick={() => handleBlur()}>X</Button>
            </div>
            <div className="row justify-content-center mt-5"><h6>{currentUser.email}</h6></div>
            <div className="row justify-content-center"><Button className="w-75 m-2 botButton" onMouseDown={handleLogout}>Log Out?</Button></div>
        </div>
    );
};

const bringToFront = {
    zIndex: "99999"
}
export default UserModal;