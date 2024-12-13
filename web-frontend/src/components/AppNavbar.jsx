import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import LogOutButton from './User/LogOutButton';

const AppNavbar = ({ user }) => {
    return(
        <Navbar className="sticky top-0" bg="dark" variant="dark" expand="lg">
            <Container className="p-1">
                <Navbar.Brand as={Link} to="/">Seminar Reservation System</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        {user.role === 'admin' &&
                            <>
                                <Nav.Link as={Link} to="/view_users">View Users</Nav.Link>
                                <Nav.Link as={Link} to="/create_seminar">Create Seminar</Nav.Link>
                            </>
                        }
                    </Nav>
                    {/* Logout Button */}
                    <Nav.Link as={Link}>
                        <LogOutButton className="btn-sm" />
                    </Nav.Link>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default AppNavbar
