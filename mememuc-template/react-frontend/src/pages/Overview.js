/**
 * References:
 * https://react-bootstrap.github.io/components/navbar/
 * https://www.youtube.com/watch?v=SLfhMt5OUPI
 * https://www.youtube.com/watch?v=bBUOMy6Tugw (Potential)
 * */

import React, {useState} from "react";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from '../logo.jpg';
import "../styles/overview.css";
import Dropdown from 'react-bootstrap/Dropdown';
import "./Post";
import Post from "./Post";

function Overview() {

    const [items, setItems] = useState([]);
    const fetchData = () => {

    };

    return (
        <div>
            <Navbar className="top">
                <Container>
                    <Nav className="me-auto">
                        <Nav.Link href="/#sort=latest">New</Nav.Link>
                        <Nav.Link href="/#sort=title">Title</Nav.Link>
                        <NavDropdown
                            title="Sort by"
                            menuVariant="light">
                            <NavDropdown.Item href="/#sort=votes">Votes</NavDropdown.Item>
                            <NavDropdown.Item href="/#sort=views">Views</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Container>
            </Navbar>
            <Post/>


        </div>


    );
}

export default Overview;
