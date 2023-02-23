import React from "react";
import "../styles/general.css";
import "../styles/overview.css";
import "../styles/profile.css";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import {BsPersonFill} from "react-icons/bs";

const loggedUsername = localStorage.getItem("loggedUsername");

class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            memes: [],
            comments: [],
            memesIsEmpty: -1,
            commentsIsEmpty: -1,
        };

        this.fetchMemesByLoggedInUser = this.fetchMemesByLoggedInUser.bind(this);
        this.fetchCommentsByLoggedInUser = this.fetchCommentsByLoggedInUser.bind(this);
    }

    componentDidMount() {
        const loggedUsername = localStorage.getItem("loggedUsername");
        this.fetchMemesByLoggedInUser(loggedUsername)
        this.fetchCommentsByLoggedInUser(loggedUsername);
    }

    fetchMemesByLoggedInUser = (loggedUsername) => {
        fetch(`http://localhost:3002/memes/get-memes/?username=${loggedUsername}`)
            .then((res) => res.json())
            .then((data) => {
                this.setState({memes: data});
                if (data.length !== 0) {
                    this.setState({memesIsEmpty: 1});
                } else {
                    this.setState({memesIsEmpty: 0});
                }
                console.log(data, "getMemeByUserInProfile");
            });
    }

    fetchCommentsByLoggedInUser = (loggedUsername) => {
        fetch(`http://localhost:3002/users/get-comments-for-someone/?username=${loggedUsername}`)
            .then((res) => res.json())
            .then((data) => {
                this.setState({comments: data});
                if (data.length !== 0) {
                    this.setState({commentsIsEmpty: 1});
                } else {
                    this.setState({commentsIsEmpty: 0});
                }
                console.log(data, "getCommentsByUserInProfile");
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
                <div className="user-info">
                    <BsPersonFill className="avatar"/>
                    <p className="username">{loggedUsername}</p>
                </div>
                <div className="data-info">
                    {this.state.memesIsEmpty !== -1 &&
                        <span className="data">Memes: {this.state.memes.length}</span>}
                    {this.state.commentsIsEmpty !== -1 &&
                        <span className="data">Comments: {this.state.comments.length}</span>}
                </div>
                <div className="bottom-space"/>
            </div>
        );
    }
}

export default Profile;