/**
 * References:
 * https://codepen.io/rares-lungescu/pen/KLbMvo
 *
 * https://www.youtube.com/watch?v=6oTDAyuQ5iw
 * */

import React from "react";
import "../styles/form.css";

// TODO: add error message, e.g. User not found. Invalid password.
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
                console.log(data, "userRegister");
                if (data.status == "ok") {
                    alert("login successful");
                    window.localStorage.setItem("token", data.data);
                    window.location.href = "./userDetails";
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