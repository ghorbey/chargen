import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav } from 'react-bootstrap';

export default function Header() {
    return (
        <Navbar bg="light" expand="lg">
            <LinkContainer to="/">
                <Navbar.Brand>Accueil</Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <LinkContainer to="/character-list">
                        <Nav.Link>Personnages</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/character">
                        <Nav.Link>Personnage</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/user-list">
                        <Nav.Link>Utilisateurs</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/preferences">
                        <Nav.Link>Paramètres</Nav.Link>
                    </LinkContainer>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}