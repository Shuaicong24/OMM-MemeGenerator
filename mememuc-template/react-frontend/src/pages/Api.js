import React from "react";
import "../styles/general.css";
import "../styles/overview.css";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";

class Api extends React.Component {

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
               API
            </div>
        );
    }
}

export default Api;