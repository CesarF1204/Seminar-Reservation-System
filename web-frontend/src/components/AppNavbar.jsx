import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AppNavbar = ({ user }) => {
    return(
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
            <Navbar.Brand as={Link} to="/">Seminar Reservation System</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link as={Link} to="/">Home</Nav.Link>
                    {user.role === 'admin' &&
                        <Nav.Link as={Link} to="/create_seminar">Create Seminar</Nav.Link>
                    }
                </Nav>
            </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default AppNavbar
