import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import LogOutButton from './User/LogOutButton';
import Notification from './Notification';

const AppNavbar = ({ user }) => {
    return(
        <Navbar className="sticky top-0" bg="dark" variant="dark" expand="lg">
            <Container className="p-1">
                <Navbar.Brand as={Link} to="/">Seminar Reservation System</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/bookings">View Bookings</Nav.Link>
                        {user.role === 'admin' &&
                            <>
                                <Nav.Link as={Link} to="/view_users">View Users</Nav.Link>
                                <Nav.Link as={Link} to="/create_seminar">Create Seminar</Nav.Link>
                            </>
                        }
                    </Nav>
                    <Nav className="ms-auto align-items-center">
                        {user.role !== 'admin' &&
                            <Notification />
                        }
                        <Nav.Item className="ms-3">
                            <LogOutButton className="btn-sm" />
                        </Nav.Item>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default AppNavbar
