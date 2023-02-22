/**
 * References for Navbar:
 * https://react-bootstrap.github.io/components/navbar/
 * https://github.com/react-bootstrap/react-bootstrap/issues/4149
 * */

import React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from '../logo.jpg';

class NavigationBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            status: false,
            loggedIn: localStorage.getItem("token")
        };
        this.handleSignOut = this.handleSignOut.bind(this);
    }

    handleSignOut() {
        window.localStorage.setItem("logStatus", "notLogged");
        window.localStorage.setItem("loggedUsername", "");
        alert("You are now logged out");
    }

    render() {
        return (
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container fluid>
                    <Navbar.Brand href="/">
                        <img
                            src={logo}
                            alt="HOME"
                            width="50"
                            height="50"/></Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll"/>
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{maxHeight: '100px'}}
                            navbarScroll
                        >
                            <NavDropdown title="Create" id="navbarScrollingDropdown">
                                <NavDropdown.Item href="/mememaker">Make a Meme</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                        <Nav id="navbar">
                            <Nav.Link href="/statistics">Statistics</Nav.Link>
                            <Nav.Link href="/api">Api</Nav.Link>
                            <Nav.Link href="/about">About</Nav.Link>
                            <Nav>
                                {
                                    (
                                        window.localStorage.getItem("logStatus") === "notLogged" ||
                                        window.localStorage.getItem("logStatus") == null
                                    ) &&
                                    <Nav.Link id="sign-in" href="/sign-in">Log In</Nav.Link>
                                }
                                {
                                    window.localStorage.getItem("logStatus") === "logged" &&
                                    <NavDropdown align="end" title={localStorage.getItem("loggedUsername")}>
                                        <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
                                        <NavDropdown.Item href="/" onClick={this.handleSignOut}>Log
                                            Out</NavDropdown.Item>
                                    </NavDropdown>
                                }
                            </Nav>
                        </Nav>


                    </Navbar.Collapse>
                </Container>
            </Navbar>
        )
    }
}

export default NavigationBar;
