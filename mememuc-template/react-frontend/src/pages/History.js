/**
 * setState Callback in a Class Component works:
 * https://upmostly.com/tutorials/how-to-use-the-setstate-callback-in-react
 * Query:
 * https://stackoverflow.com/questions/35038857/setting-query-string-using-fetch-get-request
 * */

import React from "react";
import "../styles/general.css";
import "../styles/overview.css";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";

class History extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            memes: [],
            isEmpty: -1,
        };

        this.getMemesByUser = this.getMemesByUser.bind(this);
        this.handleMeme = this.handleMeme.bind(this);
        this.Meme = this.Meme.bind(this);
    }

    componentDidMount() {
        const loggedUsername = localStorage.getItem("loggedUsername");
        this.getMemesByUser(loggedUsername);
    }

    getMemesByUser(username) {
        fetch(`http://localhost:3002/memes/get-memes/?username=${username}`)
            .then((res) => res.json())
            .then((data) => {
                this.setState({memes: data});
                if (data.length !== 0) {
                    this.setState({isEmpty: 1});
                } else {
                    this.setState({isEmpty: 0});
                }
                console.log(this.state.memes.length);
                console.log(data, "getMemeBySomeone");
            });
    }

    handleMeme() {
        localStorage.setItem("memeFrom", "History");
        localStorage.setItem("sort", 'default');
    }

    Meme = ({meme}) => {
        return (
            <div id="singlepost" className="parent-div" key={meme.toString()}>
                <a style={{"all": "unset"}} href={meme.url} onClick={this.handleMeme}>
                    <div className="media-left">
                        <img className="img-overview" src={meme.img} alt="No image here"/>
                        <div className="media-body">
                            <h5>{meme.title}</h5>
                            <span style={{'fontSize': '12px'}}>by {meme.author}</span>
                        </div>
                    </div>
                </a>
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

                {this.state.isEmpty === 1 && this.state.memes.map(meme => {
                    return <this.Meme key={meme.url}
                                      meme={meme}
                    />
                })}
                {this.state.isEmpty === 0 && <p className="no-data-text">
                    You haven't created any memes yet,<br/> try to create some with one of the generators in the
                    "Create" dropdown using your creativity!</p>}
                <div className="bottom-space"/>
            </div>
        );
    }
}

export default History;
