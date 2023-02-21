import React from "react";
import "../styles/general.css";
import "../styles/overview.css";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";

class MyComments extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            comments: [],
        };
        this.getCommentsByLoggedInUser = this.getCommentsByLoggedInUser.bind(this);

    }

    componentDidMount() {
    }

    getCommentsByLoggedInUser = () => {
        const loggedUsername = localStorage.getItem("loggedUsername");

        fetch(`http://localhost:3002/user/get-comments-for-someone/?username=${loggedUsername}`)
            .then((res) => res.json())
            .then((data) => {
                this.setState({comments: data});
                console.log(data, "getCommentsByUser");
            });
    }

    render() {
        return (
            <div>
                <Navbar className="top">
                    <Container>
                        <Nav className="me-auto">
                            <Nav.Link href="/profile">Profile</Nav.Link>
                            <Nav.Link href="/my-memes">My Memes</Nav.Link>
                            <Nav.Link href="/my-comments">My Comments</Nav.Link>
                        </Nav>
                    </Container>
                </Navbar>
            </div>
        );
    }
}

export default MyComments;