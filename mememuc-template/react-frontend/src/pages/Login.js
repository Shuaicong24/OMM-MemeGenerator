/**
 * References:
 * https://www.youtube.com/watch?v=6oTDAyuQ5iw
 * https://github.com/the-debug-arena/login-registration/blob/main/src/components/login_component.js
 * */

import React from "react";
import "../styles/form.css";
import {auth, setAuth} from "./Nav";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        const {username, password} = this.state;
        console.log(username, password);
        fetch("http://localhost:3002/login-user", {
            method: "POST",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                username,
                password,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data, "userLogin");
                if (data.status == "ok") {
                    alert("login successful");
                    window.localStorage.setItem("token", data.data);
                    window.location.href = "./userDetails";
                    this.setState({
                        auth: true
                    })
                }
            });
    }

    render() {
        return (
            <form className="form" onSubmit={this.handleSubmit}>
                <h3>Sign In</h3>

                <div className="mb-3">
                    <label>Username</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Username"
                        onChange={(e) => this.setState({username: e.target.value})}
                    />
                </div>

                <div className="mb-3">
                    <label>Password</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Enter password"
                        onChange={(e) => this.setState({password: e.target.value})}
                    />
                </div>

                <div className="d-grid">
                    <button type="submit" className="btn btn-primary">
                        Submit
                    </button>
                </div>

                <p className="forgot-password text-right">
                    New here <a href="/sign-up">sign up!</a>
                </p>
            </form>
        );
    }
}

export default Login;