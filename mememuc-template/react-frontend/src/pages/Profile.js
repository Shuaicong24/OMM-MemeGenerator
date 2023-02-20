import React from "react";
import "../styles/general.css";
import "../styles/overview.css";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";

class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            memes: [],
        };

    }

    componentDidMount() {
        const loggedUsername = localStorage.getItem("loggedUsername");
    }

    render() {
        return (
            <div>
                <Navbar className="top">
                    <Container>
                        <Nav className="me-auto">
                            <Nav.Link href="/profile">Profile</Nav.Link>
                            <Nav.Link href="/profile/#my-memes">My Memes</Nav.Link>
                            <Nav.Link href="/profile/#my-comments">My Comments</Nav.Link>
                        </Nav>
                    </Container>
                </Navbar>
            </div>
        );
    }
}

export default Profile;