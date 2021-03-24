import React, { useState, useRef, useEffect } from 'react'
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import UserIcon from '../../images/user_icon.jpg';
import UserModal from '../pages/pieces/UserModal';

const Header = () => {

	const [showModal, setShowModal] = useState(false);
	const [showNav, setShowNav] = useState(false);
	const { currentUser } = useAuth();
	const userIcon = useRef();

	useEffect(() => {
		if (currentUser === null || currentUser.uid === process.env.REACT_APP_ADMIN_USER_ID) {
			setShowNav(false);
		} else {
			setShowNav(true);
		}
	}, [currentUser]);
	
	const showUserModal = () => {
		setShowModal(showModal=>!showModal);
	}

	return (
		<div>
			<header className="title text-center">
				<h1>My School Aid</h1>
				<div hidden={!currentUser} className="userIcon" onClick={showUserModal} style={backgroundImage} ref={userIcon} />
			</header>
			{ showNav &&
				<nav className="navbar navbar-dark bg-dark firstNav navRow" >
					<NavLink className="NavLink w-25 text-center navBlock" activeStyle={active} 
						exact to="/viewschedule">View Schedule</NavLink>

					<NavLink className="NavLink w-25 text-center navBlock" activeStyle={active}  
						to="/createevents">Create Events</NavLink>

					<NavLink className="NavLink w-25 text-center navBlock" activeStyle={active}  
						to="/searchevents">Search Events</NavLink>

					<NavLink className="NavLink w-25 text-center navBlock" activeStyle={active}  
						to="/flashcard/home">Flashcards</NavLink>
				</nav>
			}
			{showModal &&
				<UserModal setShowModal={setShowModal} />
			}
			
		</div>
	)
}
const backgroundImage = {
	backgroundImage: `url(${UserIcon})`
}
const active = {
	backgroundColor: "rgb(62, 126, 126)"
}

export default Header;