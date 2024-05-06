import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap';
import './NavbarComponent.css';

// Assuming custom CSS for the Navbar


const NavbarComponent = () => {

    return (
        <>
            <Navbar sticky='top' bg="dark" variant="dark" expand="lg" className=" navbar-custom">
                <Container>
                    <Navbar.Brand as={Link} to="/">
                        <img
                            alt=""
                            src="/logo.svg" // Adjust the path as necessary
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                        />{' '}
                        Form-GPT POC
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/" className="nav-item">
                                <i className="fa fa-home"></i> Home
                            </Nav.Link>
                            <Nav.Link as={Link} to="/create" className="nav-item">
                                <i className="fa fa-plus"></i> Create Form
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            
        </>

    );
};

export default NavbarComponent;
