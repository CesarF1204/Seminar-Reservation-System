import React, { useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import LogOutButton from './User/LogOutButton';
import Notification from './Notification';

const AppNavbar = ({ user }) => {
    /* State to check if Navbar collapse */
    const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);

    /* Handle the navbar collapse */
    const handleNavbarToggle = () => {
        setIsNavbarCollapsed(prevState => !prevState);
    };

    return(
        <Navbar className="sticky top-0" bg="dark" variant="dark" expand="lg">
            <Container className="p-1">
                <Navbar.Brand as={Link} to="/">Seminar Reservation System</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={handleNavbarToggle} />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/dashboard" state={{ isNavbarCollapsed }}>Home</Nav.Link>
                        <Nav.Link as={Link} to="/bookings">View Bookings</Nav.Link>
                        {user.role === 'admin' &&
                            <>
                                <Nav.Link as={Link} to="/view_users">View Users</Nav.Link>
                                <Nav.Link as={Link} to="/create_seminar">Create Seminar</Nav.Link>
                            </>
                        }
                    </Nav>
                    <Nav className="ms-auto align-items-start">
                        {user.role !== 'admin' &&
                            <Notification isNavbarCollapsed={isNavbarCollapsed} />
                        }
                        <Nav.Item className="mt-1">
                            <LogOutButton className="btn-sm" />
                        </Nav.Item>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default AppNavbar
