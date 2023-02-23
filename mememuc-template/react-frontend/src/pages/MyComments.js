/**
 * Get specific time:
 * https://stackoverflow.com/questions/4402934/javascript-time-and-date-getting-the-current-minute-hour-day-week-month-y
 * */

import React from "react";
import "../styles/general.css";
import "../styles/overview.css";
import "../styles/singleview.css";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";

class MyComments extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            isEmpty: -1,
        };

        this.getCommentsByLoggedInUser = this.getCommentsByLoggedInUser.bind(this);
        this.Comment = this.Comment.bind(this);
    }

    componentDidMount() {
        const loggedUsername = localStorage.getItem("loggedUsername");
        this.getCommentsByLoggedInUser(loggedUsername);
    }

    getCommentsByLoggedInUser = (loggedUsername) => {
        fetch(`http://localhost:3002/users/get-comments-for-someone/?username=${loggedUsername}`)
            .then((res) => res.json())
            .then((data) => {
                this.setState({comments: data});
                if (data.length !== 0) {
                    this.setState({isEmpty: 1});
                } else {
                    this.setState({isEmpty: 0});
                }
                console.log(data, "getCommentsByUser");
            });
    }

    Comment = ({comment}) => {
        const date = new Date();
        date.setTime(comment.date);

        return (
            <div className="single_comment">
                <p className="strict">{comment.content}</p>
                <div>
                    <span className="from_someone">to {comment.to},
                        on {date.getFullYear()}-{date.getMonth()}-{date.getDate()},
                        at {date.getHours()}:{date.getMinutes()}:{date.getSeconds()}</span>
                </div>
            </div>
        );
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

                {this.state.isEmpty === 0 && <p className="no-data-text">
                    You haven't made any comments.</p>}
                {this.state.isEmpty === 1 && this.state.comments.map(comment => {
                    return <this.Comment key={comment.date}
                                         comment={comment}/>
                })}
                <div className="bottom-space"/>
            </div>
        );
    }
}

export default MyComments;